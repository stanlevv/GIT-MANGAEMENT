<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Notification;

$students = User::where('role', 'student')->get();

foreach ($students as $student) {
    Notification::create([
        'user_id' => $student->id,
        'type' => 'pembayaran_spp',
        'title' => 'Tagihan SPP Baru',
        'body' => 'Tagihan SPP bulan Mei 2026 telah diterbitkan. Silakan lakukan pembayaran sebelum jatuh tempo.',
        'data' => ['amount' => 850000],
    ]);

    Notification::create([
        'user_id' => $student->id,
        'type' => 'kampanye_baru',
        'title' => 'Kampanye Donasi Baru',
        'body' => 'Ada kampanye donasi baru: "Beasiswa Siswa Kurang Mampu". Mari bantu sesama!',
        'data' => ['campaign_id' => 1],
    ]);
}

echo "Notifications seeded successfully.\n";
