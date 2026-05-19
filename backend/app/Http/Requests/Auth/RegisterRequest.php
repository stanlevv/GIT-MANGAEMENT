<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => ['required', new Enum(UserRole::class)],
            'nisn'     => 'required_if:role,parent|required_if:role,student|string|size:10',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Nama wajib diisi.',
            'email.required'    => 'Email wajib diisi.',
            'email.unique'      => 'Email sudah terdaftar.',
            'password.min'      => 'Password minimal 6 karakter.',
            'role.required'     => 'Role wajib dipilih.',
            'nisn.required_if'  => 'NISN wajib diisi untuk siswa/orang tua.',
            'nisn.size'         => 'NISN harus 10 digit.',
        ];
    }

    public function userRole(): UserRole
    {
        return UserRole::from($this->validated('role'));
    }
}
