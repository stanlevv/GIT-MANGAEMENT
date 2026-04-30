<?php

namespace App\Console\Commands;

use App\Models\Bill;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateMonthlyBills extends Command
{
    /**
     * php artisan bills:generate          → bulan ini
     * php artisan bills:generate 2026-05  → bulan tertentu
     */
    protected $signature   = 'bills:generate {month? : Format YYYY-MM, default bulan ini}';
    protected $description = 'Generate tagihan SPP bulanan untuk semua siswa yang belum punya tagihan bulan ini';

    /**
     * Komponen tagihan default (bisa dikustomisasi per sekolah ke depannya).
     * Total: 850.000
     */
    private array $defaultItems = [
        ['name' => 'SPP',          'amount' => 500000],
        ['name' => 'Kegiatan',     'amount' => 150000],
        ['name' => 'Lab',          'amount' => 125000],
        ['name' => 'Perpustakaan', 'amount' =>  75000],
    ];

    public function handle(): int
    {
        $monthParam = $this->argument('month');

        // Tentukan periode tagihan
        $date = $monthParam
            ? Carbon::createFromFormat('Y-m', $monthParam)->startOfMonth()
            : Carbon::now()->startOfMonth();

        $monthLabel = $date->translatedFormat('F Y'); // "April 2026"
        $dueDate    = $date->copy()->endOfMonth()->toDateString(); // "2026-04-30"
        $total      = array_sum(array_column($this->defaultItems, 'amount'));

        $this->info("📅 Generate tagihan untuk: {$monthLabel} (jatuh tempo {$dueDate})");

        $students  = Student::all();
        $generated = 0;
        $skipped   = 0;

        foreach ($students as $student) {
            // Cek apakah tagihan bulan ini sudah ada
            $exists = Bill::where('student_id', $student->id)
                          ->where('month', $monthLabel)
                          ->exists();

            if ($exists) {
                $skipped++;
                continue;
            }

            Bill::create([
                'student_id'   => $student->id,
                'month'        => $monthLabel,
                'status'       => 'Tertunggak',
                'due_date'     => $dueDate,
                'total_amount' => $total,
                'items'        => $this->defaultItems,
            ]);

            $generated++;
        }

        $this->info("✅ {$generated} tagihan dibuat, {$skipped} dilewati (sudah ada).");
        $this->info("👨‍🎓 Total siswa: {$students->count()}");

        return Command::SUCCESS;
    }
}
