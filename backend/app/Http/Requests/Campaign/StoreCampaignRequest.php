<?php

namespace App\Http\Requests\Campaign;

use App\Enums\CampaignStatus;
use App\Enums\CampaignType;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        $role = $this->user()?->role;
        $roleValue = $role instanceof UserRole ? $role->value : $role;
        return $roleValue === 'admin_sekolah';
    }

    public function rules(): array
    {
        return [
            'title'         => 'required|string|max:255',
            'description'   => 'required|string',
            'target_amount' => 'required|numeric|min:100000',
            'type'          => ['required', new Enum(CampaignType::class)],
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'image_url'     => 'nullable|url',
            'status'        => ['nullable', new Enum(CampaignStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'         => 'Judul kampanye wajib diisi.',
            'target_amount.min'      => 'Target dana minimal Rp 100.000.',
            'type.required'          => 'Tipe kampanye wajib dipilih.',
            'end_date.after_or_equal' => 'Tanggal selesai harus setelah tanggal mulai.',
        ];
    }
}
