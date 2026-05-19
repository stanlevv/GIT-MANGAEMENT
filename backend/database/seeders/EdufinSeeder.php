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

        // Clear existing dynamic data to ensure clean state
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\Bill::truncate();
        \App\Models\Student::truncate();
        \App\Models\Notification::truncate();
        \App\Models\Campaign::truncate();
        // Clear students and parents but keep admin
        User::where('role', '!=', 'admin_sekolah')->delete();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ── 1. Admin Sekolah ──────────────────────────────────────────────────
        User::updateOrCreate(
            ['email'    => 'admin@edufin.sch.id'],
            [
                'name'     => 'Admin SMA 3 Malang',
                'password' => Hash::make('admin123'),
                'role'     => 'admin_sekolah',
            ]
        );

        // ── 2. Donatur ────────────────────────────────────────────────────────
        User::create([
            'name'     => 'Rina Permata',
            'email'    => 'rina@gmail.com',
            'password' => Hash::make('password123'),
            'role'     => 'donor',
        ]);

        // ── 3. Data Siswa (SMA 3 Kota Malang) ─────────────────────────────────
        $classes = ['X', 'XI', 'XII'];
        $studentsCreated = [];

        foreach ($classes as $classIdx => $className) {
            // Group 1: 5 Siswa dengan 1 Ortu yang sama
            $parentName1 = "Bp. Sutrisno (" . $className . ")";
            $address1    = "Jl. Ijen No. " . (10 + $classIdx) . ", Malang";
            $phone1      = "081233445566";

            for ($i = 1; $i <= 5; $i++) {
                $studentName = "Siswa " . $className . " - " . $i;
                $nisn        = "10" . ($classIdx + 1) . "00000" . $i;
                $email       = "siswa" . strtolower($className) . $i . "@student.sch.id";

                $user = User::create([
                    'name'         => $studentName,
                    'email'        => $email,
                    'password'     => Hash::make('password123'),
                    'role'         => 'student',
                    'phone_number' => '08' . rand(100000000, 999999999)
                ]);

                $studentsCreated[] = Student::create([
                    'user_id'     => $user->id,
                    'nisn'        => $nisn,
                    'name'        => $studentName,
                    'parent_name' => $parentName1,
                    'school_name' => 'SMA 3 Kota Malang',
                    'class_name'  => $className,
                    'address'     => $address1,
                    'registration_data' => [
                        'initial_address' => $address1,
                        'initial_phone'   => $user->phone_number,
                        'registration_date' => Carbon::now()->toDateTimeString(),
                    ]
                ]);
            }

            // Group 2: 2 Siswa dengan 1 Ortu yang sama (Siblings)
            $parentName2 = "Bp. Hendra Santoso";
            $address2    = "Jl. Veteran No. 99, Malang";
            
            for ($i = 1; $i <= 2; $i++) {
                $studentName = "Anak Hendra " . $className . " " . $i;
                $nisn        = "20" . ($classIdx + 1) . "00000" . $i;
                $email       = "anak" . strtolower($className) . $i . "@student.sch.id";

                // Test Case Budi (Siswa)
                if ($className === 'X' && $i === 1) {
                    $studentName = "Budi Santoso";
                    $email = "budi@student.sch.id";
                    $nisn = "2000000001";
                }

                $user = User::create([
                    'name'         => $studentName,
                    'email'        => $email,
                    'password'     => Hash::make('password123'),
                    'role'         => 'student',
                    'phone_number' => '08' . rand(100000000, 999999999)
                ]);

                $studentsCreated[] = Student::create([
                    'user_id'     => $user->id,
                    'nisn'        => $nisn,
                    'name'        => $studentName,
                    'parent_name' => $parentName2,
                    'school_name' => 'SMA 3 Kota Malang',
                    'class_name'  => $className,
                    'address'     => $address2,
                    'registration_data' => [
                        'initial_address' => $address2,
                        'initial_phone'   => $user->phone_number,
                        'registration_date' => Carbon::now()->toDateTimeString(),
                    ]
                ]);
            }
        }

        // ── 4. Tagihan & Notifikasi ───────────────────────────────────────────
        $months = [];
        for ($i = 3; $i >= 0; $i--) {
            $date     = Carbon::now()->subMonths($i)->startOfMonth();
            $months[] = [
                'label'    => $date->translatedFormat('F Y'),
                'due_date' => $date->copy()->endOfMonth()->toDateString(),
                'is_past'  => $i > 0, 
            ];
        }

        foreach ($studentsCreated as $student) {
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

            // Tambah notifikasi default
            \App\Models\Notification::create([
                'user_id' => $student->user_id,
                'type'    => 'pembayaran_spp',
                'title'   => 'Tagihan Baru Terbit',
                'body'    => 'Tagihan SPP bulan ' . Carbon::now()->translatedFormat('F Y') . ' sudah tersedia.',
                'created_at' => Carbon::now(),
            ]);
        }

        // ── 5. Kampanye Donasi ────────────────────────────────────────────────
        Campaign::create([
            'title'          => 'Beasiswa Prestasi SMA 3 Malang',
            'description'    => 'Bantu teman-teman kita yang berprestasi namun terkendala biaya.',
            'target_amount'  => 50000000,
            'current_amount' => 15000000,
            'image_url'      => 'https://images.unsplash.com/photo-1523050335392-938511794244?w=400',
            'status'         => 'active',
        ]);

        Campaign::create([
            'title'          => 'Dana Darurat Kesehatan Siswa',
            'description'    => 'Penyediaan dana kesehatan darurat untuk siswa yang membutuhkan.',
            'target_amount'  => 20000000,
            'current_amount' => 5000000,
            'image_url'      => 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
            'status'         => 'active',
        ]);

        $this->command->info('✅ Database Edufin SMA 3 Kota Malang berhasil di-seed!');
    }
}
