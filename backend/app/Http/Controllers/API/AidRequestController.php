<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AidRequest;
use App\Models\Campaign;
use App\Models\Bill;
use Illuminate\Http\Request;

class AidRequestController extends Controller
{
    /**
     * Dapatkan semua pengajuan bantuan (Admin view).
     */
    public function index()
    {
        $aidRequests = AidRequest::with(['user', 'student', 'fundPool.campaign'])->latest()->get();
        return response()->json(['aid_requests' => $aidRequests]);
    }

    /**
     * Ajukan permohonan bantuan dana.
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'bill_ids'   => 'required|array',
            'reason'     => 'required|string',
        ]);

        $aidRequest = AidRequest::create([
            'user_id'    => $request->user()->id,
            'student_id' => $request->student_id,
            'bill_ids'   => $request->bill_ids,
            'reason'     => $request->reason,
            'status'     => 'pending',
        ]);

        return response()->json(['success' => true, 'aid_request' => $aidRequest], 201);
    }

    /**
     * Setujui pengajuan (Admin).
     * Saat disetujui, admin harus memilih Fund Pool mana yang akan digunakan.
     */
    public function approve(Request $request, AidRequest $aidRequest)
    {
        $request->validate([
            'fund_pool_id' => 'required|exists:fund_pools,id',
        ]);

        $fundPool = \App\Models\FundPool::findOrFail($request->fund_pool_id);

        // Hitung total tagihan (kolom yang benar adalah total_amount)
        $bills = Bill::whereIn('id', $aidRequest->bill_ids)->get();
        $totalAmount = $bills->sum('total_amount');

        // Cek saldo
        if ($fundPool->balance < $totalAmount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo fund pool tidak mencukupi untuk menutupi tagihan ini.'
            ], 400);
        }

        // Potong saldo
        $fundPool->decrement('balance', $totalAmount);

        // Set status tagihan menjadi Lunas (dibayarkan oleh Fund Pool)
        Bill::whereIn('id', $aidRequest->bill_ids)->update(['status' => 'Lunas']);

        // Update status pengajuan
        $aidRequest->update([
            'status' => 'approved',
            'fund_pool_id' => $fundPool->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan bantuan disetujui dan dana telah dipotong dari Fund Pool.',
            'aid_request' => $aidRequest
        ]);
    }

    /**
     * Tolak pengajuan (Admin).
     */
    public function reject(Request $request, AidRequest $aidRequest)
    {
        $aidRequest->update(['status' => 'rejected']);
        return response()->json(['success' => true, 'message' => 'Pengajuan ditolak.']);
    }
}
