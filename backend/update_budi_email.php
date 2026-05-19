<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$u = User::where('email', 'budi@student.sch.id')->first();
if ($u) {
    $u->email = 'budi@gmail.com';
    $u->save();
    echo "Updated Budi's email to budi@gmail.com\n";
} else {
    $u2 = User::where('email', 'budi@gmail.com')->first();
    if ($u2) {
        echo "Budi already has email budi@gmail.com\n";
    } else {
        echo "Budi not found\n";
    }
}
