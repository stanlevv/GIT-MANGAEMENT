<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'month', 'status', 'due_date', 'total_amount', 'items'
    ];

    protected $casts = [
        'items' => 'array',
        'due_date' => 'date'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
