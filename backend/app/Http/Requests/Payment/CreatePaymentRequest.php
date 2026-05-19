<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bill_ids'       => 'required|array|min:1',
            'bill_ids.*'     => 'integer|exists:bills,id',
            'payment_method' => 'required|string',
            'payment_type'   => 'required|in:penuh,2x,3x',
            'amount_paid'    => 'required|numeric|min:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'bill_ids.required'       => 'Pilih tagihan yang ingin dibayar.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'amount_paid.min'         => 'Jumlah pembayaran minimal Rp 1.000.',
        ];
    }
}
