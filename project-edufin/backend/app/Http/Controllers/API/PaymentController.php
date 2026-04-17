<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Buat transaksi pembayaran baru (menggantikan mock di PaySPP.tsx).
     * Dalam produksi, di sini kita integrasikan dengan Midtrans/Xendit.
     */
    public function create(Request $request)
    {
        $request->validate([
            'bill_ids'       => 'required|array',
            'payment_method' => 'required|string',
            'payment_type'   => 'required|in:penuh,2x,3x',
            'amount_paid'    => 'required|numeric|min:1000',
        ]);

        $user       = $request->user();
        $receiptNo  = 'EDU' . date('Ym') . strtoupper(substr(uniqid(), -6));

        // Buat record pembayaran dengan status pending
        $payment = Payment::create([
            'user_id'        => $user->id,
            'receipt_no'     => $receiptNo,
            'amount_paid'    => $request->amount_paid,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'payment_type'   => $request->payment_type,
            'bill_ids'       => $request->bill_ids,
        ]);

        // ============================================================
        // TODO untuk produksi: Integrasikan Midtrans di sini
        // $midtrans = MidtransService::createTransaction($payment);
        // return response()->json(['snap_token' => $midtrans->token]);
        // ============================================================

        // Untuk keperluan tugas IMK: langsung set success & update status tagihan
        $payment->payment_status = 'success';
        $payment->save();

        // Update status tagihan menjadi Lunas
        Bill::whereIn('id', $request->bill_ids)->update(['status' => 'Lunas']);

        return response()->json([
            'success'    => true,
            'receipt_no' => $receiptNo,
            'payment'    => $payment,
        ]);
    }

    /**
     * Ambil riwayat pembayaran user yang login.
     */
    public function history(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json(['payments' => $payments]);
    }
}
