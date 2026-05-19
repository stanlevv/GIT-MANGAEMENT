<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'student_id'   => $this->student_id,
            'month'        => $this->month,
            'status'       => $this->status,
            'due_date'     => $this->due_date?->toDateString(),
            'total_amount' => (float) $this->total_amount,
            'items'        => $this->items,
            'student'      => new StudentResource($this->whenLoaded('student')),
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}
