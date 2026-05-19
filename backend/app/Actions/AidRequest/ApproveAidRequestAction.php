<?php

namespace App\Actions\AidRequest;

use App\Models\AidRequest;
use App\Models\Bill;
use App\Models\FundPool;
use Illuminate\Validation\ValidationException;

class ApproveAidRequestAction
{
    /**
     * Approve an aid request and deduct from fund pool.
     */
    public function execute(AidRequest $aidRequest, int $fundPoolId): AidRequest
    {
        $fundPool = FundPool::findOrFail($fundPoolId);

        // Hitung total tagihan
        $bills = Bill::whereIn('id', $aidRequest->bill_ids)->get();
        $totalAmount = $bills->sum('total_amount');

        // Cek saldo pool
        if ($fundPool->balance < $totalAmount) {
            throw ValidationException::withMessages([
                'fund_pool_id' => 'Saldo fund pool tidak mencukupi. Dibutuhkan Rp ' .
                    number_format($totalAmount, 0, ',', '.') .
                    ', tersedia Rp ' . number_format($fundPool->balance, 0, ',', '.') . '.',
            ]);
        }

        // Potong saldo pool
        $fundPool->decrement('balance', $totalAmount);

        // Set tagihan jadi Lunas
        Bill::whereIn('id', $aidRequest->bill_ids)->update(['status' => 'Lunas']);

        // Update status pengajuan
        $aidRequest->update([
            'status'       => 'approved',
            'fund_pool_id' => $fundPool->id,
        ]);

        return $aidRequest->fresh(['user', 'student', 'fundPool.campaign']);
    }
}
