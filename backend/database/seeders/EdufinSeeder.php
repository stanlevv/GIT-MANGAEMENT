<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Bill;
use App\Models\Campaign;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class EdufinSeeder extends Seeder
{
    private array $defaultItems = [
        ['name' => 'SPP',          'amount' => 500000],
        ['name' => 'Kegiatan',     'amount' => 150000],
        ['name' => 'Lab',          'amount' => 125000],
        ['name' => 'Perpustakaan', 'amount' =>  75000],
    ];

    public function run(): void
    {
        $total = array_sum(array_column($this->defaultItems, 'amount')); // 850000

        // ── 1. Admin Sekolah ──────────────────────────────────────────────────
        User::create([
            'name'     => 'Admin SDN 3 Malang',
            'email'    => 'admin@edufin.sch.id',
            'password' => Hash::make('admin123'),
            'role'     => 'admin_sekolah',
        ]);

        // ── 2. Orang Tua / Wali ──────────────────────────────────────────────
        $parent1 = User::create([
            'name'     => 'Hendra Santoso',
            'email'    => 'hendra@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'parent',
        ]);

        $parent2 = User::create([
            'name'     => 'Dewi Rahayu',
            'email'    => 'dewi@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'parent',
        ]);

        $parent3 = User::create([
            'name'     => 'Slamet Riyadi',
            'email'    => 'slamet@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'parent',
        ]);

        // ── 3. Donatur ────────────────────────────────────────────────────────
        User::create([
            'name'     => 'Rina Permata',
            'email'    => 'rina@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'donor',
        ]);

        User::create([
            'name'     => 'Bapak Dermawan',
            'email'    => 'dermawan@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'donor',
        ]);

        // ── 4. Data Siswa ─────────────────────────────────────────────────────
        $student1 = Student::create([
            'parent_id'   => $parent1->id,
            'name'        => 'Budi Santoso',
            'nisn'        => '0012345678',
            'school_name' => 'SDN 3 Malang',
            'class_name'  => 'X IPA 1',
            'address'     => 'Jl. Veteran No.12, Malang',
        ]);

        $student2 = Student::create([
            'parent_id'   => $parent2->id,
            'name'        => 'Citra Dewi Rahayu',
            'nisn'        => '0087654321',
            'school_name' => 'SMPN 5 Batu',
            'class_name'  => 'VIII B',
            'address'     => 'Jl. Diponegoro No.45, Batu',
        ]);

        $student3 = Student::create([
            'parent_id'   => $parent3->id,
            'name'        => 'Ahmad Rizki Pratama',
            'nisn'        => '0099887766',
            'school_name' => 'SMA Negeri 2 Kepanjen',
            'class_name'  => 'XII IPA 2',
            'address'     => 'Jl. Pahlawan No.7, Kepanjen',
        ]);

        $student4 = Student::create([
            'parent_id'   => $parent1->id,
            'name'        => 'Sari Santoso',
            'nisn'        => '0011223344',
            'school_name' => 'SDN 3 Malang',
            'class_name'  => 'VII A',
            'address'     => 'Jl. Veteran No.12, Malang',
        ]);

        // ── 5. Tagihan 6 Bulan Terakhir ───────────────────────────────────────
        // Buat tagihan 6 bulan terakhir untuk setiap siswa
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date     = Carbon::now()->subMonths($i)->startOfMonth();
            $months[] = [
                'label'    => $date->translatedFormat('F Y'), // "November 2025"
                'due_date' => $date->copy()->endOfMonth()->toDateString(),
                'is_past'  => $i > 0, // bulan lalu = lunas, bulan ini = tertunggak
            ];
        }

        foreach ([$student1, $student2, $student3, $student4] as $student) {
            foreach ($months as $month) {
                Bill::create([
                    'student_id'   => $student->id,
                    'month'        => $month['label'],
                    'status'       => $month['is_past'] ? 'Lunas' : 'Tertunggak',
                    'due_date'     => $month['due_date'],
                    'total_amount' => $total,
                    'items'        => $this->defaultItems,
                ]);
            }
        }

        // ── 6. Kampanye Donasi ────────────────────────────────────────────────
        Campaign::create([
            'title'          => 'Beasiswa Siswa Kurang Mampu 2026',
            'description'    => 'Bantu siswa berprestasi yang kesulitan membayar SPP agar tetap bisa bersekolah. Setiap donasi Anda memberi harapan kepada generasi penerus bangsa.',
            'target_amount'  => 50000000,
            'current_amount' => 18500000,
            'image_url'      => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
            'status'         => 'active',
        ]);

        Campaign::create([
            'title'          => 'Renovasi Perpustakaan SDN 3 Malang',
            'description'    => 'Wujudkan perpustakaan yang nyaman dengan koleksi buku yang lengkap untuk mendukung semangat belajar siswa.',
            'target_amount'  => 30000000,
            'current_amount' => 12000000,
            'image_url'      => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
            'status'         => 'active',
        ]);

        Campaign::create([
            'title'          => 'Perlengkapan Lab Komputer SMPN 5 Batu',
            'description'    => 'Pengadaan 20 unit komputer baru untuk mendukung kegiatan belajar teknologi informasi siswa.',
            'target_amount'  => 80000000,
            'current_amount' => 5000000,
            'image_url'      => 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
            'status'         => 'active',
        ]);

        Campaign::create([
            'title'          => 'Program Makan Siang Bergizi SMA Kepanjen',
            'description'    => 'Pastikan setiap siswa mendapatkan asupan gizi yang cukup untuk semangat belajar setiap hari.',
            'target_amount'  => 15000000,
            'current_amount' => 11200000,
            'image_url'      => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
            'status'         => 'active',
        ]);

        $this->command->info('');
        $this->command->info('✅ Data EDUFIN berhasil di-seed!');
        $this->command->info('──────────────────────────────────────────');
        $this->command->info('🏫 Admin Sekolah : admin@edufin.sch.id   | admin123');
        $this->command->info('👨 Orang Tua 1   : hendra@gmail.com      | password123');
        $this->command->info('👩 Orang Tua 2   : dewi@gmail.com        | password123');
        $this->command->info('👨 Orang Tua 3   : slamet@gmail.com      | password123');
        $this->command->info('💝 Donatur 1     : rina@gmail.com        | password123');
        $this->command->info('💝 Donatur 2     : dermawan@gmail.com    | password123');
        $this->command->info('──────────────────────────────────────────');
        $this->command->info('🎓 NISN: 0012345678 | 0087654321 | 0099887766 | 0011223344');
        $this->command->info('📅 Tagihan: 6 bulan terakhir (5 Lunas, bulan ini Tertunggak)');
        $this->command->info('');
    }
}
