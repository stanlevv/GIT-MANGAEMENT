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
            'nisn'     => 'required_if:role,parent|string|size:10',
        ]);

        $student = null;

        // Parent hanya boleh register dengan NISN yang valid dan belum diklaim parent lain.
        if ($request->role === 'parent') {
            $student = Student::where('nisn', $request->nisn)->first();

            if (!$student) {
                return response()->json(['message' => 'NISN tidak valid.'], 422);
            }

            if ($student->parent_id !== null) {
                return response()->json([
                    'message' => 'NISN ini sudah terhubung ke akun lain. Hubungi admin sekolah jika ada kendala.'
                ], 409);
            }
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        if ($student) {
            $student->update(['parent_id' => $user->id]);
        }

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

    /**
     * Login via Google (Hanya untuk Donor).
     */
    public function googleAuth(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        // Ambil info user dari Google menggunakan access_token
        $response = \Illuminate\Support\Facades\Http::withToken($request->access_token)
            ->get('https://www.googleapis.com/oauth2/v3/userinfo');

        if (!$response->successful()) {
            return response()->json(['success' => false, 'message' => 'Token Google tidak valid.'], 401);
        }

        $googleUser = $response->json();

        // Pastikan email diverifikasi oleh Google
        // Google API v3 mengembalikan email_verified sebagai boolean, bukan string "true"
        if (empty($googleUser['email_verified'])) {
            return response()->json(['success' => false, 'message' => 'Email Google belum diverifikasi.'], 401);
        }

        // Cari user berdasarkan email
        $user = User::where('email', $googleUser['email'])->first();

        if ($user) {
            // Jika user ada tapi bukan donor
            if ($user->role !== 'donor' && $user->role !== 'donatur') {
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

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }
}
