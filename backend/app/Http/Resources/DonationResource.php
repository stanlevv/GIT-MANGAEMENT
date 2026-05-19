<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'amount'         => (float) $this->amount,
            'is_anonymous'   => (bool) $this->is_anonymous,
            'payment_status' => $this->payment_status,
            'message'        => $this->message,
            'donor'          => $this->when(!$this->is_anonymous, new UserResource($this->whenLoaded('donor'))),
            'campaign'       => new CampaignResource($this->whenLoaded('campaign')),
            'created_at'     => $this->created_at?->toISOString(),
        ];
    }
}
