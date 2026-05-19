<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\BillResource;
use App\Http\Resources\CampaignResource;
use App\Http\Resources\NotificationResource;
use App\Http\Resources\StudentResource;
use App\Models\Bill;
use App\Models\Campaign;
use App\Models\Notification;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Ambil data tagihan SPP milik siswa dari user yang login.
     * Juga auto-generate tagihan bulan ini jika belum ada.
     */
    public function bills(Request $request)
    {
        $user     = $request->user();
        $students = Student::where('user_id', $user->id)->get();

        if ($students->isEmpty()) {
            return response()->json(['bills' => [], 'students' => []]);
        }

        $studentIds    = $students->pluck('id');
        $currentMonth  = Carbon::now()->translatedFormat('F Y'); // "April 2026"
        $dueDate       = Carbon::now()->endOfMonth()->toDateString();
        $defaultItems  = [
            ['name' => 'SPP',          'amount' => 500000],
            ['name' => 'Kegiatan',     'amount' => 150000],
            ['name' => 'Lab',          'amount' => 125000],
            ['name' => 'Perpustakaan', 'amount' =>  75000],
        ];
        $total = array_sum(array_column($defaultItems, 'amount'));

        // Auto-generate tagihan bulan ini jika belum ada
        foreach ($students as $student) {
            $exists = Bill::where('student_id', $student->id)
                          ->where('month', $currentMonth)
                          ->exists();
            if (!$exists) {
                Bill::create([
                    'student_id'   => $student->id,
                    'month'        => $currentMonth,
                    'status'       => 'Tertunggak',
                    'due_date'     => $dueDate,
                    'total_amount' => $total,
                    'items'        => $defaultItems,
                ]);
            }
        }

        $bills = Bill::whereIn('student_id', $studentIds)
                     ->orderBy('created_at', 'desc')
                     ->get();

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $campaigns = Campaign::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'bills'         => BillResource::collection($bills),
            'students'      => StudentResource::collection($students),
            'notifications' => NotificationResource::collection($notifications),
            'campaigns'     => CampaignResource::collection($campaigns),
        ]);
    }

    /**
     * Info lengkap siswa milik user yang login.
     */
    public function myStudents(Request $request)
    {
        $students = Student::where('user_id', $request->user()->id)->get();
        return StudentResource::collection($students);
    }

    /**
     * Tambah data siswa baru ke user (parent) yang login.
     */
    public function addStudent(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string|size:10|exists:students,nisn',
        ]);

        $student = Student::where('nisn', $request->nisn)->first();

        // Kaitkan student ke user yang login
        $student->user_id = $request->user()->id;
        $student->save();

        return response()->json([
            'success' => true,
            'student' => new StudentResource($student),
        ]);
    }

    /**
     * Update profil siswa (Alamat dan Nomor HP).
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'phone_number' => 'nullable|string',
            'address'      => 'nullable|string',
        ]);

        $user = $request->user();

        // Update phone number di tabel users
        if ($request->has('phone_number')) {
            $user->phone_number = $request->phone_number;
            $user->save();
        }

        // Update address di tabel students (asumsi 1 user = 1 student untuk skenario ini, ambil yang pertama)
        if ($request->has('address')) {
            $student = Student::where('user_id', $user->id)->first();
            if ($student) {
                $student->address = $request->address;
                $student->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui'
        ]);
    }
}
