<?php

namespace App\Http\Controllers\API;

use App\Actions\Auth\LoginAction;
use App\Actions\Auth\RegisterAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
                'parentName' => $student->parent_name,
                'address'    => $student->address,
            ]
        ]);
    }

    /**
     * Register akun baru — delegated to RegisterAction.
     */
    public function register(RegisterRequest $request, RegisterAction $action)
    {
        $result = $action->execute($request->validated());

        return (new UserResource($result['user']))
            ->additional(['success' => true, 'token' => $result['token']])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Login pengguna — delegated to LoginAction.
     */
    public function login(LoginRequest $request, LoginAction $action)
    {
        $result = $action->execute($request->email, $request->password);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        return (new UserResource($result['user']))
            ->additional(['success' => true, 'token' => $result['token']]);
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
        return new UserResource($request->user()->load('students'));
    }

    /**
     * Login via Google (Hanya untuk Donor).
     */
    public function googleAuth(Request $request)
    {
        $request->validate([
            'credential' => 'required|string',
        ]);

        // Verifikasi ID Token via Google API
        $response = \Illuminate\Support\Facades\Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->credential
        ]);

        if (!$response->successful()) {
            return response()->json(['success' => false, 'message' => 'Token Google (ID Token) tidak valid.'], 401);
        }

        $googleUser = $response->json();

        // Pastikan email diverifikasi oleh Google
        if (empty($googleUser['email_verified']) || $googleUser['email_verified'] !== "true" && $googleUser['email_verified'] !== true) {
            return response()->json(['success' => false, 'message' => 'Email Google belum diverifikasi.'], 401);
        }

        // Cari user berdasarkan email
        $user = User::where('email', $googleUser['email'])->first();

        if ($user) {
            // Jika user ada tapi bukan donor
            $roleValue = $user->role instanceof \App\Enums\UserRole ? $user->role->value : $user->role;
            if ($roleValue !== 'donor' && $roleValue !== 'donatur') {
                return response()->json(['success' => false, 'message' => 'Akun Google ini terdaftar sebagai role lain.'], 403);
            }
            // Update avatar jika ada
            if (!empty($googleUser['picture'])) {
                $user->update(['avatar' => $googleUser['picture']]);
            }
        } else {
            // Buat user baru sebagai donor
            $user = User::create([
                'name'     => $googleUser['name'] ?? 'Donatur Anonim',
                'email'    => $googleUser['email'],
                'password' => Hash::make(\Illuminate\Support\Str::random(24)),
                'role'     => 'donor',
                'avatar'   => $googleUser['picture'] ?? null,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return (new UserResource($user))
            ->additional(['success' => true, 'token' => $token]);
    }
}
