<?php
use App\Models\User;
use App\Models\Notification;

$user = User::where('email', 'budi@student.sch.id')->first();
if ($user) {
    Notification::create([
        'user_id' => $user->id,
        'type' => 'info',
        'title' => 'Selamat Datang!',
        'body' => 'Selamat datang di dashboard baru Edufin. Sekarang kamu bisa melihat tagihan dan riwayat pembayaranmu dengan lebih mudah.',
        'data' => ['url' => '/student/billing']
    ]);
    Notification::create([
        'user_id' => $user->id,
        'type' => 'warning',
        'title' => 'Tagihan Baru',
        'body' => 'Tagihan SPP bulan Mei 2026 sudah tersedia. Silakan lakukan pembayaran sebelum tanggal jatuh tempo.',
        'data' => ['url' => '/student/spp']
    ]);
    echo "Notifications created for Budi (ID: {$user->id})\n";
} else {
    echo "Budi not found\n";
}
