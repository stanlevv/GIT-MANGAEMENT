<?php

namespace App\Http\Requests\Campaign;

use Illuminate\Foundation\Http\FormRequest;

class DonateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount'       => 'required|numeric|min:10000',
            'is_anonymous' => 'boolean',
            'message'      => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal donasi wajib diisi.',
            'amount.min'      => 'Minimal donasi Rp 10.000.',
        ];
    }
}
