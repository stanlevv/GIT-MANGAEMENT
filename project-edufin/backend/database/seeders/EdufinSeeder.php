<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Bill;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EdufinSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Admin Sekolah ──────────────────────────────
        $admin = User::create([
            'name'     => 'Admin EDUFIN',
            'email'    => 'admin@edufin.sch.id',
            'password' => Hash::make('admin123'),
            'role'     => 'admin_sekolah',
        ]);

        // ── 2. Orang Tua Demo ─────────────────────────────
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

        // ── 3. Data Siswa (NISN Demo) ─────────────────────
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
            'parent_id'   => null,
            'name'        => 'Ahmad Rizki Pratama',
            'nisn'        => '0099887766',
            'school_name' => 'SMA Negeri 2 Kepanjen',
            'class_name'  => 'XII IPA 2',
            'address'     => 'Jl. Pahlawan No.7, Kepanjen',
        ]);

        // ── 4. Tagihan SPP Demo ───────────────────────────
        $billsData = [
            ['month' => 'April 2026', 'status' => 'Tertunggak', 'due_date' => '2026-04-30'],
            ['month' => 'Maret 2026', 'status' => 'Lunas',      'due_date' => '2026-03-31'],
            ['month' => 'Februari 2026', 'status' => 'Lunas',   'due_date' => '2026-02-28'],
        ];

        $defaultItems = [
            ['name' => 'SPP',           'amount' => 500000],
            ['name' => 'Kegiatan',      'amount' => 150000],
            ['name' => 'Lab',           'amount' => 125000],
            ['name' => 'Perpustakaan',  'amount' => 75000],
        ];

        foreach ([$student1, $student2, $student3] as $student) {
            foreach ($billsData as $bill) {
                $items = $defaultItems;
                $total = array_sum(array_column($items, 'amount'));
                Bill::create([
                    'student_id'   => $student->id,
                    'month'        => $bill['month'],
                    'status'       => $bill['status'],
                    'due_date'     => $bill['due_date'],
                    'total_amount' => $total,
                    'items'        => $items,
                ]);
            }
        }

        // ── 5. Kampanye Donasi Demo ───────────────────────
        Campaign::create([
            'title'          => 'Beasiswa Siswa Kurang Mampu 2026',
            'description'    => 'Bantu siswa berprestasi yang kesulitan membayar SPP agar tetap bisa bersekolah.',
            'target_amount'  => 50000000,
            'current_amount' => 18500000,
            'status'         => 'active',
        ]);

        Campaign::create([
            'title'          => 'Renovasi Perpustakaan Sekolah',
            'description'    => 'Wujudkan perpustakaan yang nyaman dan koleksi buku yang lengkap untuk siswa.',
            'target_amount'  => 30000000,
            'current_amount' => 12000000,
            'status'         => 'active',
        ]);

        Campaign::create([
            'title'          => 'Perlengkapan Lab Komputer',
            'description'    => 'Pengadaan 20 unit komputer baru untuk mendukung kegiatan belajar mengajar.',
            'target_amount'  => 80000000,
            'current_amount' => 5000000,
            'status'         => 'active',
        ]);

        $this->command->info('✅ Data EDUFIN berhasil di-seed!');
        $this->command->info('📧 Admin: admin@edufin.sch.id | password: admin123');
        $this->command->info('📧 Ortu 1: hendra@gmail.com | password: password123');
        $this->command->info('🎓 NISN Demo: 0012345678 | 0087654321 | 0099887766');
    }
}
