<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'email'        => $this->email,
            'role'         => $this->role instanceof \App\Enums\UserRole ? $this->role->value : $this->role,
            'phone_number' => $this->phone_number,
            'avatar'       => $this->avatar,
            'students'     => StudentResource::collection($this->whenLoaded('students')),
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}
