<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\API\HelpdeskController;
use App\Http\Controllers\API\SchoolController;


// ──────────────────────────────────────────────────────────
// Public Routes (Tidak perlu login)
// ──────────────────────────────────────────────────────────

// Autentikasi
Route::post('/auth/lookup-nisn', [AuthController::class, 'lookupNISN']);
Route::post('/auth/register',    [AuthController::class, 'register']);
Route::post('/auth/login',       [AuthController::class, 'login']);
Route::post('/auth/google',      [AuthController::class, 'googleAuth']);

// Webhook
Route::post('/payment/webhook',  [PaymentController::class, 'webhook']);

// Helpdesk (publik — bisa diakses sebelum login)
Route::post('/helpdesk/ticket', [HelpdeskController::class, 'store']);

// Kampanye Donasi (bisa dilihat publik)
Route::get('/campaigns',                     [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign}',          [CampaignController::class, 'show']);
Route::post('/campaigns/{campaign}/donate',  [CampaignController::class, 'donate']);


// ──────────────────────────────────────────────────────────
// Protected Routes (Wajib login / Bearer Token)
// ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ── Siswa & Orang Tua (role: parent) ──────────────────
    Route::get('/student/bills',       [StudentController::class, 'bills']);
    Route::get('/student/my-students', [StudentController::class, 'myStudents']);
    Route::post('/student/add',        [StudentController::class, 'addStudent']);

    // Pengajuan Bantuan
    Route::post('/aid-requests', [App\Http\Controllers\API\AidRequestController::class, 'store']);

    // Pembayaran
    Route::post('/payment/create',   [PaymentController::class, 'create']);
    Route::get('/payment/history',   [PaymentController::class, 'history']);

    // ── Sekolah (role: admin_sekolah) ─────────────────────
    Route::prefix('school')->group(function () {
        Route::get('/dashboard', [SchoolController::class, 'dashboard']);
        Route::get('/students',  [SchoolController::class, 'students']);
        Route::get('/bills',     [SchoolController::class, 'bills']);
        Route::get('/payments',  [SchoolController::class, 'payments']);
        
        // Manajemen Pengajuan Bantuan
        Route::get('/aid-requests',                           [App\Http\Controllers\API\AidRequestController::class, 'index']);
        Route::post('/aid-requests/{aidRequest}/approve',     [App\Http\Controllers\API\AidRequestController::class, 'approve']);
        Route::post('/aid-requests/{aidRequest}/reject',      [App\Http\Controllers\API\AidRequestController::class, 'reject']);

        // Manajemen Pengeluaran Proyek
        Route::get('/project-expenses',      [App\Http\Controllers\API\ProjectExpenseController::class, 'index']);
        Route::post('/project-expenses',     [App\Http\Controllers\API\ProjectExpenseController::class, 'store']);
    });

    // ── Admin: Buat & Kelola Kampanye ────────────────────────
    Route::post('/campaigns',                   [CampaignController::class, 'store']);
    Route::put('/campaigns/{campaign}',         [CampaignController::class, 'update']);
    Route::delete('/campaigns/{campaign}',      [CampaignController::class, 'destroy']);
});
