<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'nisn'              => $this->nisn,
            'name'              => $this->name,
            'school_name'       => $this->school_name,
            'class_name'        => $this->class_name,
            'parent_name'       => $this->parent_name,
            'address'           => $this->address,
            'registration_data' => $this->registration_data,
            'bills'             => BillResource::collection($this->whenLoaded('bills')),
            'user'              => new UserResource($this->whenLoaded('user')),
        ];
    }
}
