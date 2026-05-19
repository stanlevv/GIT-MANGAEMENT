<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$u = App\Models\User::where('email', 'hendra@gmail.com')->first();
$s = App\Models\Student::where('parent_id', $u->id)->pluck('id');
$bills = App\Models\Bill::whereIn('student_id', $s)->where('status', '!=', 'Lunas')->get();

echo "Total tagihan belum lunas: " . $bills->count() . "\n";
echo "Total nominal tunggakan: Rp " . number_format($bills->sum('total_amount'), 0, ',', '.') . "\n";

foreach($bills as $b) {
    echo "- " . $b->month . " (" . $b->status . "): Rp " . number_format($b->total_amount, 0, ',', '.') . "\n";
}
