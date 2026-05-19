<?php

namespace App\Actions\Auth;

use App\Enums\UserRole;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisterAction
{
    /**
     * Execute registration logic.
     *
     * @return array{user: User, token: string}
     */
    public function execute(array $data): array
    {
        $role = UserRole::from($data['role']);
        $student = null;

        // Parent atau Student hanya boleh register dengan NISN valid
        if ($role->isStudentOrParent()) {
            $student = Student::where('nisn', $data['nisn'])->first();

            if (!$student) {
                throw ValidationException::withMessages([
                    'nisn' => 'NISN tidak valid.',
                ]);
            }

            if ($student->user_id !== null) {
                throw ValidationException::withMessages([
                    'nisn' => 'NISN ini sudah terhubung ke akun lain. Hubungi admin sekolah jika ada kendala.',
                ]);
            }
        }

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $role->value,
        ]);

        if ($student) {
            $student->update(['user_id' => $user->id]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user->load('students'), 'token' => $token];
    }
}
