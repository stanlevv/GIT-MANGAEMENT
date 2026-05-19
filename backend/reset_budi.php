<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$u = User::where('email', 'budi@student.sch.id')->first();
if ($u) {
    $u->password = Hash::make('password123');
    $u->save();
    echo "Password reset for Budi Santoso (budi@student.sch.id) to 'password123'\n";
} else {
    echo "User Budi not found\n";
}
