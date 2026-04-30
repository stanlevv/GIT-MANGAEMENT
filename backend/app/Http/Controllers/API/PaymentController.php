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

    public function history(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json(['payments' => $payments]);
    }

    /**
     * Webhook Endpoint (Menerima callback dari Midtrans)
     */
    public function webhook(Request $request)
    {
        // Dalam implementasi nyata, verifikasi signature key Midtrans di sini
        
        $order_id = $request->order_id;
        $transaction_status = $request->transaction_status;

        if ($transaction_status == 'settlement' || $transaction_status == 'capture') {
            
            // 1. Jika ini Donasi
            if (str_starts_with($order_id, 'DON-')) {
                $donationId = str_replace('DON-', '', $order_id);
                $donation = \App\Models\Donation::find($donationId);
                
                if ($donation && $donation->payment_status != 'success') {
                    $donation->update(['payment_status' => 'success']);
                    
                    // Tambahkan ke pool dan campaign
                    $campaign = \App\Models\Campaign::find($donation->campaign_id);
                    if ($campaign) {
                        $campaign->increment('current_amount', $donation->amount);
                        if ($campaign->fundPool) {
                            $campaign->fundPool()->increment('balance', $donation->amount);
                        }
                    }
                }
            } 
            // 2. Jika ini Pembayaran SPP (EDU-xxx)
            else {
                $payment = Payment::where('receipt_no', $order_id)->first();
                
                if ($payment && $payment->payment_status != 'success') {
                    $payment->update(['payment_status' => 'success']);
                    Bill::whereIn('id', $payment->bill_ids)->update(['status' => 'Lunas']);
                }
            }
        }

        return response()->json(['success' => true]);
    }
}
