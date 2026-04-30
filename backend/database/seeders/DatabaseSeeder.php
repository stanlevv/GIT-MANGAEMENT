<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Bill;
use App\Models\Campaign;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Admin Sekolah ─────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@edufin.sch.id'],
            [
                'name'     => 'Admin EDUFIN School',
                'password' => Hash::make('admin123'),
                'role'     => 'admin_sekolah',
            ]
        );

        // ── 2. Orang Tua / Siswa ─────────────────────────────────
        $parent = User::firstOrCreate(
            ['email' => 'hendra@gmail.com'],
            [
                'name'     => 'Hendra Kusuma',
                'password' => Hash::make('password123'),
                'role'     => 'parent',
            ]
        );

        // ── 3. Donatur ────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'rina@gmail.com'],
            [
                'name'     => 'Rina Sartika',
                'password' => Hash::make('password123'),
                'role'     => 'donor',
            ]
        );

        // ── 4. Siswa milik parent Hendra ─────────────────────────
        $student = Student::firstOrCreate(
            ['nisn' => '1234567890'],
            [
                'parent_id'   => $parent->id,
                'name'        => 'Budi Kusuma',
                'school_name' => 'SMA EDUFIN 1 Jakarta',
                'class_name'  => 'XII IPA 2',
                'address'     => 'Jl. Pendidikan No. 12, Jakarta',
            ]
        );

        // ── 5. Tagihan SPP siswa (3 bulan) ───────────────────────
        $months = [
            ['month' => 'Februari 2025', 'status' => 'Lunas',    'due' => '2025-02-10'],
            ['month' => 'Maret 2025',    'status' => 'Lunas',    'due' => '2025-03-10'],
            ['month' => 'April 2025',    'status' => 'Tertunggak','due' => '2025-04-10'],
        ];
        foreach ($months as $m) {
            Bill::firstOrCreate(
                ['student_id' => $student->id, 'month' => $m['month']],
                [
                    'status'       => $m['status'],
                    'due_date'     => $m['due'],
                    'total_amount' => 725000,
                    'items'        => json_encode([
                        ['name' => 'SPP Bulanan',  'amount' => 500000],
                        ['name' => 'Kegiatan',     'amount' => 125000],
                        ['name' => 'Ekstrakulikuler', 'amount' => 100000],
                    ]),
                ]
            );
        }

        // ── 6. Kampanye Donasi Demo ───────────────────────────────
        $campaign = Campaign::firstOrCreate(
            ['title' => 'Beasiswa Siswa Berprestasi SMA EDUFIN'],
            [
                'description'    => 'Membantu siswa berprestasi yang kurang mampu agar tetap bisa melanjutkan pendidikan. Dana digunakan untuk SPP, buku, dan perlengkapan sekolah.',
                'target_amount'  => 50000000,
                'current_amount' => 18500000,
                'type'           => 'bantuan_siswa',
                'status'         => 'active',
                'image_url'      => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
            ]
        );
        if (!$campaign->fundPool) {
            $campaign->fundPool()->create(['balance' => 18500000]);
        }

        Campaign::firstOrCreate(
            ['title' => 'Renovasi Lab Komputer EDUFIN'],
            [
                'description'    => 'Pengadaan 20 unit komputer baru untuk menunjang proses belajar siswa di era digital.',
                'target_amount'  => 80000000,
                'current_amount' => 42000000,
                'type'           => 'proyek_sekolah',
                'status'         => 'active',
                'image_url'      => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
            ]
        )->each(function ($c) {
            if (!$c->fundPool) {
                $c->fundPool()->create(['balance' => 42000000]);
            }
        });

        $this->command->info('✅ Demo accounts dan data seeded!');
        $this->command->info('   🏫 Admin  : admin@edufin.sch.id / admin123');
        $this->command->info('   🎓 Orang Tua: hendra@gmail.com / password123');
        $this->command->info('   ❤️  Donatur : rina@gmail.com / password123');
    }
}
