<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Validasi NISN dari database MySQL (menggantikan mock data di React).
     */
    public function lookupNISN(Request $request)
    {
        $request->validate(['nisn' => 'required|string|size:10']);

        $student = Student::where('nisn', $request->nisn)->first();

        if (!$student) {
            return response()->json([
                'found' => false,
                'message' => 'NISN tidak ditemukan. Pastikan NISN sesuai dengan kartu pelajar.'
            ], 404);
        }

        return response()->json([
            'found' => true,
            'data' => [
                'nisn'       => $student->nisn,
                'name'       => $student->name,
                'school'     => $student->school_name,
                'class'      => $student->class_name,
                'parentName' => $student->parent ? $student->parent->name : '-',
                'address'    => $student->address,
            ]
        ]);
    }

    /**
     * Register akun baru (Siswa/Orang Tua atau Donatur).
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'required|in:parent,donor',
            'nisn'     => 'nullable|string|size:10',
        ]);

        // Cek NISN jika role parent/siswa
        if ($request->role === 'parent' && $request->nisn) {
            $studentExists = Student::where('nisn', $request->nisn)->exists();
            if (!$studentExists) {
                return response()->json(['message' => 'NISN tidak valid.'], 422);
            }
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    /**
     * Login pengguna.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    /**
     * Logout.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logout berhasil.']);
    }

    /**
     * Get profil user yang sedang login.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('students');
        return response()->json(['user' => $user]);
    }
}
