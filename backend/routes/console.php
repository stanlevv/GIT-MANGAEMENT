<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Auto-generate tagihan SPP di tanggal 1 setiap bulan jam 00:05 ──────────
Schedule::command('bills:generate')->monthlyOn(1, '00:05');
