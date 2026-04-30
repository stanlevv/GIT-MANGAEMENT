<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FundPool extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id', 'balance'
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function aidRequests()
    {
        return $this->hasMany(AidRequest::class);
    }
}
