<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FundPoolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'balance'  => (float) $this->balance,
            'campaign' => new CampaignResource($this->whenLoaded('campaign')),
        ];
    }
}
