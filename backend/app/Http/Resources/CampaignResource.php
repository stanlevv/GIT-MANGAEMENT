<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $target = (float) $this->target_amount;
        $current = (float) $this->current_amount;

        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'description'    => $this->description,
            'type'           => $this->type,
            'status'         => $this->status,
            'target_amount'  => $target,
            'current_amount' => $current,
            'progress'       => $target > 0 ? round(($current / $target) * 100, 1) : 0,
            'image_url'      => $this->image_url,
            'start_date'     => $this->start_date,
            'end_date'       => $this->end_date,
            'donor_count'    => $this->whenCounted('donations'),
            'donations'      => DonationResource::collection($this->whenLoaded('donations')),
            'fund_pool'      => new FundPoolResource($this->whenLoaded('fundPool')),
            'created_at'     => $this->created_at?->toISOString(),
        ];
    }
}
