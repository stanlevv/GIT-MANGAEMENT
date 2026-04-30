<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
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
        $students = Student::where('parent_id', $user->id)->get();

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

        return response()->json([
            'bills'    => $bills,
            'students' => $students,
        ]);
    }

    /**
     * Info lengkap siswa milik user yang login.
     */
    public function myStudents(Request $request)
    {
        $user     = $request->user();
        $students = Student::where('parent_id', $user->id)->get();

        return response()->json(['students' => $students]);
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
        $student->parent_id = $request->user()->id;
        $student->save();

        return response()->json([
            'success' => true,
            'student' => $student
        ]);
    }
}
