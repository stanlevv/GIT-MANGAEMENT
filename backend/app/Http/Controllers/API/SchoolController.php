<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    /**
     * Dashboard sekolah: ringkasan tagihan & statistik.
     * (untuk role admin_sekolah)
     */
    public function dashboard(Request $request)
    {
        $totalStudents  = Student::count();
        $totalBills     = Bill::count();
        $paidBills      = Bill::where('status', 'Lunas')->count();
        $unpaidBills    = Bill::where('status', 'Tertunggak')->count();
        $totalCollected = Payment::where('payment_status', 'success')->sum('amount_paid');

        return response()->json([
            'stats' => [
                'total_students'  => $totalStudents,
                'total_bills'     => $totalBills,
                'paid_bills'      => $paidBills,
                'unpaid_bills'    => $unpaidBills,
                'total_collected' => $totalCollected,
            ]
        ]);
    }

    /**
     * Daftar semua siswa beserta status tagihan terkini.
     */
    public function students(Request $request)
    {
        $students = Student::with(['bills' => function ($q) {
            $q->orderBy('created_at', 'desc')->limit(1);
        }, 'parent:id,name,email'])
        ->get()
        ->map(function ($student) {
            $latestBill = $student->bills->first();
            return [
                'id'          => $student->id,
                'name'        => $student->name,
                'nisn'        => $student->nisn,
                'school_name' => $student->school_name,
                'class_name'  => $student->class_name,
                'parent_name' => $student->parent?->name ?? '-',
                'latest_bill' => $latestBill ? [
                    'month'  => $latestBill->month,
                    'status' => $latestBill->status,
                    'total'  => $latestBill->total_amount,
                ] : null,
            ];
        });

        return response()->json(['students' => $students]);
    }

    /**
     * Semua tagihan (dengan filter bulan opsional).
     */
    public function bills(Request $request)
    {
        $query = Bill::with('student:id,name,nisn,class_name')
                     ->orderBy('created_at', 'desc');

        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $bills = $query->paginate(20);

        return response()->json($bills);
    }

    /**
     * Riwayat semua pembayaran (laporan).
     */
    public function payments(Request $request)
    {
        $payments = Payment::with('user:id,name,email')
                           ->where('payment_status', 'success')
                           ->orderBy('created_at', 'desc')
                           ->paginate(20);

        return response()->json($payments);
    }
}
