<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;

$s = Student::whereHas('user', function($q) { 
    $q->where('email', 'budi@student.sch.id'); 
})->first();

if ($s) {
    echo "Student Name: " . $s->name . "\n";
    echo "Parent Name: " . $s->parent_name . "\n";
    echo "NISN: " . $s->nisn . "\n";
} else {
    echo "Student record not found for Budi\n";
}
