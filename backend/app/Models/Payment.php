<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'receipt_no', 'amount_paid', 'payment_method', 
        'payment_status', 'payment_type', 'midtrans_transaction_id', 'bill_ids'
    ];

    protected $casts = [
        'bill_ids' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
