<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\API\HelpdeskController;
use App\Http\Controllers\API\SchoolController;
use App\Http\Controllers\API\AidRequestController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\ProjectExpenseController;


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

    // ── Siswa & Orang Tua (role: parent, student) ──────────
    Route::middleware('role:parent,student')->group(function () {
        Route::get('/student/bills',       [StudentController::class, 'bills']);
        Route::get('/student/my-students', [StudentController::class, 'myStudents']);
        Route::post('/student/add',        [StudentController::class, 'addStudent']);
        Route::post('/student/update-profile', [StudentController::class, 'updateProfile']);

        // Pengajuan Bantuan
        Route::get('/aid-requests/me', [AidRequestController::class, 'myRequests']);
        Route::post('/aid-requests',   [AidRequestController::class, 'store']);
    });

    // Pembayaran (bisa diakses parent, student, dan donor)
    Route::get('/payment/channels',  [PaymentController::class, 'getChannels']);
    Route::post('/payment/create',   [PaymentController::class, 'create']);
    Route::get('/payment/history',   [PaymentController::class, 'history']);

    // Notifikasi (semua role yang login)
    Route::get('/notifications',             [NotificationController::class, 'index']);
    Route::post('/notifications/read-all',   [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notification}',    [NotificationController::class, 'destroy']);

    // ── Sekolah (role: admin_sekolah) ─────────────────────
    Route::middleware('role:admin_sekolah')->prefix('school')->group(function () {
        Route::get('/dashboard', [SchoolController::class, 'dashboard']);
        Route::get('/students',  [SchoolController::class, 'students']);
        Route::get('/bills',     [SchoolController::class, 'bills']);
        Route::get('/payments',  [SchoolController::class, 'payments']);

        // Manajemen Pengajuan Bantuan
        Route::get('/aid-requests',                           [AidRequestController::class, 'index']);
        Route::post('/aid-requests/{aidRequest}/approve',     [AidRequestController::class, 'approve']);
        Route::post('/aid-requests/{aidRequest}/reject',      [AidRequestController::class, 'reject']);

        // Manajemen Pengeluaran Proyek
        Route::get('/project-expenses',      [ProjectExpenseController::class, 'index']);
        Route::post('/project-expenses',     [ProjectExpenseController::class, 'store']);
    });

    // ── Admin: Buat & Kelola Kampanye ────────────────────────
    Route::middleware('role:admin_sekolah')->group(function () {
        Route::post('/campaigns',                   [CampaignController::class, 'store']);
        Route::put('/campaigns/{campaign}',         [CampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}',      [CampaignController::class, 'destroy']);
    });
});
