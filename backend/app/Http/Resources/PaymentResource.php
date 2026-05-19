<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'receipt_no'     => $this->receipt_no,
            'amount_paid'    => (float) $this->amount_paid,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'payment_type'   => $this->payment_type,
            'bill_ids'       => $this->bill_ids,
            'user'           => new UserResource($this->whenLoaded('user')),
            'created_at'     => $this->created_at?->toISOString(),
        ];
    }
}
