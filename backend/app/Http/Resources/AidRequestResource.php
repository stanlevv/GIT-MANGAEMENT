<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AidRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'status'       => $this->status,
            'reason'       => $this->reason,
            'bill_ids'     => $this->bill_ids,
            'user'         => new UserResource($this->whenLoaded('user')),
            'student'      => new StudentResource($this->whenLoaded('student')),
            'fund_pool'    => new FundPoolResource($this->whenLoaded('fundPool')),
            'created_at'   => $this->created_at?->toISOString(),
            'updated_at'   => $this->updated_at?->toISOString(),
        ];
    }
}
