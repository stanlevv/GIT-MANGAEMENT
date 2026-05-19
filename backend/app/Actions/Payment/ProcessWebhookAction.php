<?php

namespace App\Actions\Payment;

use App\Models\Bill;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Payment;
use App\Services\TripayService;
use Illuminate\Http\Request;

class ProcessWebhookAction
{
    public function __construct(
        private TripayService $tripay,
    ) {}

    /**
     * @return array{success: bool, message?: string}
     */
    public function execute(Request $request): array
    {
        // Verifikasi signature
        if (!$this->tripay->validateCallbackSignature($request)) {
            return ['success' => false, 'message' => 'Invalid signature'];
        }

        // Hanya proses jika status = PAID
        if ($request->status !== 'PAID') {
            return ['success' => true, 'message' => 'Not a paid event'];
        }

        $orderId = $request->merchant_ref;

        // Donasi (DON-xxx)
        if (str_starts_with($orderId, 'DON-')) {
            $this->processDonationWebhook($orderId);
        }
        // Pembayaran SPP (EDU-xxx)
        else {
            $this->processSppWebhook($orderId);
        }

        return ['success' => true];
    }

    private function processDonationWebhook(string $orderId): void
    {
        $donationId = str_replace('DON-', '', $orderId);
        $donation = Donation::find($donationId);

        if (!$donation || $donation->payment_status === 'success') {
            return;
        }

        $donation->update(['payment_status' => 'success']);

        $campaign = Campaign::find($donation->campaign_id);
        if ($campaign) {
            $campaign->increment('current_amount', $donation->amount);
            $campaign->fundPool?->increment('balance', $donation->amount);
        }
    }

    private function processSppWebhook(string $orderId): void
    {
        $payment = Payment::where('receipt_no', $orderId)->first();

        if (!$payment || $payment->payment_status === 'success') {
            return;
        }

        $payment->update(['payment_status' => 'success']);
        Bill::whereIn('id', $payment->bill_ids)->update(['status' => 'Lunas']);
    }
}
