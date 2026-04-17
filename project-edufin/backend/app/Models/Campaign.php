<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'target_amount', 'current_amount', 'image_url', 'status'
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
