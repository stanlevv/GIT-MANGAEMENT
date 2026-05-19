<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use App\Models\Bill;

$parentName = 'Hendra Santoso';
$students = Student::where('parent_name', $parentName)->get();

echo "Parent: $parentName\n";
echo "Students found: " . $students->count() . "\n";

$totalDebt = 0;
foreach ($students as $student) {
    $bills = Bill::where('student_id', $student->id)->where('status', '!=', 'Lunas')->get();
    $studentDebt = $bills->sum('total_amount');
    echo " - Student: {$student->name} (NISN: {$student->nisn}), Debt: $studentDebt\n";
    $totalDebt += $studentDebt;
}

echo "Total Debt for $parentName: " . number_format($totalDebt, 0, ',', '.') . "\n";
