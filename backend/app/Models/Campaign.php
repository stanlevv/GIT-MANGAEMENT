<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'target_amount', 'current_amount',
        'image_url', 'status', 'type', 'start_date', 'end_date'
    ];

    /**
     * Default values untuk field yang tidak wajib diisi saat create.
     * - status: 'active' agar langsung muncul di list publik
     * - current_amount: 0 agar progress bar tidak null
     */
    protected $attributes = [
        'status'         => 'active',
        'current_amount' => 0,
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function fundPool()
    {
        return $this->hasOne(FundPool::class);
    }
}
