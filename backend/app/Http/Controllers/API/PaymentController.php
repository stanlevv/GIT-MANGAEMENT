<?php

namespace App\Http\Controllers\API;

use App\Actions\Payment\CreatePaymentAction;
use App\Actions\Payment\ProcessWebhookAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CreatePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Services\TripayService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Buat transaksi pembayaran baru — delegated to Action.
     */
    public function create(CreatePaymentRequest $request, CreatePaymentAction $action)
    {
        $result = $action->execute($request->user(), $request->validated());

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], 500);
        }

        return response()->json([
            'success'      => true,
            'receipt_no'   => $result['receipt_no'],
            'payment'      => new PaymentResource($result['payment']),
            'checkout_url' => $result['checkout_url'],
        ]);
    }

    /**
     * Dapatkan channel Tripay untuk Frontend.
     */
    public function getChannels(TripayService $tripay)
    {
        $channels = $tripay->getPaymentChannels();

        if ($channels && $channels['success']) {
            return response()->json(['success' => true, 'data' => $channels['data']]);
        }

        return response()->json(['success' => false, 'message' => 'Gagal memuat metode pembayaran'], 500);
    }

    /**
     * Riwayat pembayaran user.
     */
    public function history(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
                           ->orderBy('created_at', 'desc')
                           ->get();

        return PaymentResource::collection($payments)
            ->additional(['success' => true]);
    }

    /**
     * Webhook Endpoint — delegated to Action.
     */
    public function webhook(Request $request, ProcessWebhookAction $action)
    {
        $result = $action->execute($request);

        $statusCode = ($result['success'] ?? false) ? 200 : 403;
        return response()->json($result, $statusCode);
    }
}
