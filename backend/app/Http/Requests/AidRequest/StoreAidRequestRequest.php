<?php

namespace App\Http\Requests\AidRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreAidRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'required|exists:students,id',
            'bill_ids'   => 'required|array|min:1',
            'bill_ids.*' => 'integer|exists:bills,id',
            'reason'     => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'Pilih siswa yang mengajukan.',
            'bill_ids.required'   => 'Pilih tagihan yang ingin dibantu.',
            'reason.required'     => 'Alasan pengajuan wajib diisi.',
        ];
    }
}
