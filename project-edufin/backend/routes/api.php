<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\API\HelpdeskController;


// ──────────────────────────────────────────────────────────
// Public Routes (Tidak perlu login)
// ──────────────────────────────────────────────────────────

// Autentikasi
Route::post('/auth/lookup-nisn', [AuthController::class, 'lookupNISN']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Helpdesk (publik — bisa diakses sebelum login)
Route::post('/helpdesk/ticket', [HelpdeskController::class, 'store']);

// Kampanye Donasi (bisa dilihat publik)
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);
Route::post('/campaigns/{campaign}/donate', [CampaignController::class, 'donate']);


// ──────────────────────────────────────────────────────────
// Protected Routes (Wajib login / Bearer Token)
// ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Siswa & Tagihan
    Route::get('/student/bills', [StudentController::class, 'bills']);
    Route::get('/student/my-students', [StudentController::class, 'myStudents']);
    Route::post('/student/add', [StudentController::class, 'addStudent']);

    // Pembayaran
    Route::post('/payment/create', [PaymentController::class, 'create']);
    Route::get('/payment/history', [PaymentController::class, 'history']);

    // Admin: Buat Kampanye
    Route::post('/campaigns', [CampaignController::class, 'store']);
});
