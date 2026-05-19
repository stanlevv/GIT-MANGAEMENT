<?php

namespace App\Actions\Campaign;

use App\Models\Campaign;
use App\Models\Donation;

class ProcessDonationAction
{
    /**
     * @return array{success: bool, donation: Donation, order_id: string}
     */
    public function execute(Campaign $campaign, array $data, ?int $donorId): array
    {
        $donation = Donation::create([
            'campaign_id'    => $campaign->id,
            'donor_id'       => $donorId,
            'amount'         => $data['amount'],
            'is_anonymous'   => $data['is_anonymous'] ?? false,
            'payment_status' => 'pending',
            'message'        => $data['message'] ?? null,
        ]);

        $orderId = 'DON-' . $donation->id;

        // Simulasi pembayaran langsung berhasil (dev mode)
        // Pada produksi: return snap_token dari Tripay/Midtrans
        $donation->update(['payment_status' => 'success']);
        $campaign->increment('current_amount', $data['amount']);

        if ($campaign->fundPool) {
            $campaign->fundPool()->increment('balance', $data['amount']);
        }

        return [
            'success'  => true,
            'donation' => $donation,
            'order_id' => $orderId,
        ];
    }
}
