<?php

namespace App\Actions\Payment;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\User;
use App\Services\TripayService;

class CreatePaymentAction
{
    public function __construct(
        private TripayService $tripay,
    ) {}

    /**
     * @return array{success: bool, payment?: Payment, checkout_url?: string, message?: string}
     */
    public function execute(User $user, array $data): array
    {
        $receiptNo = 'EDU' . date('Ym') . strtoupper(substr(uniqid(), -6));

        $payment = Payment::create([
            'user_id'        => $user->id,
            'receipt_no'     => $receiptNo,
            'amount_paid'    => $data['amount_paid'],
            'payment_method' => $data['payment_method'],
            'payment_status' => 'pending',
            'payment_type'   => $data['payment_type'],
            'bill_ids'       => $data['bill_ids'],
        ]);

        $customerDetails = [
            'name'  => $user->name,
            'email' => $user->email ?? 'student@edufin.id',
            'phone' => $user->phone_number ?? '08123456789',
        ];

        $orderItems = [[
            'sku'      => 'SPP',
            'name'     => 'Pembayaran SPP (' . $data['payment_type'] . ')',
            'price'    => (int) $data['amount_paid'],
            'quantity' => 1,
        ]];

        $tripayResponse = $this->tripay->createTransaction(
            $receiptNo,
            (int) $data['amount_paid'],
            $customerDetails,
            $orderItems,
            $data['payment_method']
        );

        if ($tripayResponse['success'] ?? false) {
            return [
                'success'      => true,
                'payment'      => $payment,
                'receipt_no'   => $receiptNo,
                'checkout_url' => $tripayResponse['data']['checkout_url'],
            ];
        }

        return [
            'success' => false,
            'message' => 'Gagal terhubung ke gerbang pembayaran: ' . ($tripayResponse['message'] ?? 'Error tidak diketahui'),
        ];
    }
}
