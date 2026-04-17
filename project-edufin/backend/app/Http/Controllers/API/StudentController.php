<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Ambil data tagihan SPP milik siswa dari user yang login.
     */
    public function bills(Request $request)
    {
        $user     = $request->user();
        $students = Student::where('parent_id', $user->id)->pluck('id');

        $bills = Bill::whereIn('student_id', $students)
                     ->orderBy('created_at', 'desc')
                     ->get();

        return response()->json(['bills' => $bills]);
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
            'nisn'        => 'required|string|size:10|exists:students,nisn',
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
