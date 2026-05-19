<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Student;
use App\Models\Bill;

echo "=== USER ===\n";
$u = User::where('email', 'budi@gmail.com')->first();
if (!$u) {
    echo "User budi@gmail.com NOT FOUND\n";
    exit;
}
echo "ID: {$u->id}\n";
echo "Name: {$u->name}\n";
echo "Email: {$u->email}\n";
echo "Role: {$u->role}\n";
echo "Phone: {$u->phone_number}\n";

echo "\n=== STUDENTS ===\n";
$students = Student::where('user_id', $u->id)->get();
if ($students->isEmpty()) {
    echo "NO students linked to this user!\n";
} else {
    foreach ($students as $s) {
        echo "Student ID: {$s->id}, Name: {$s->name}, NISN: {$s->nisn}, School: {$s->school_name}, Class: {$s->class_name}\n";
    }
}

echo "\n=== BILLS ===\n";
$studentIds = $students->pluck('id');
$bills = Bill::whereIn('student_id', $studentIds)->orderBy('created_at', 'desc')->get();
if ($bills->isEmpty()) {
    echo "NO bills for this student!\n";
} else {
    foreach ($bills as $b) {
        echo "Bill #{$b->id} | Month: {$b->month} | Status: {$b->status} | Amount: {$b->total_amount} | Due: {$b->due_date}\n";
        $items = is_string($b->items) ? json_decode($b->items, true) : $b->items;
        if ($items) {
            foreach ($items as $item) {
                echo "  - {$item['name']}: Rp " . number_format($item['amount'], 0, ',', '.') . "\n";
            }
        }
    }
}

echo "\n=== TOKENS (active) ===\n";
$tokens = \Laravel\Sanctum\PersonalAccessToken::where('tokenable_id', $u->id)->get();
echo "Total tokens: " . $tokens->count() . "\n";
foreach ($tokens->take(3) as $t) {
    echo "Token #{$t->id} | Name: {$t->name} | Last used: {$t->last_used_at}\n";
}
