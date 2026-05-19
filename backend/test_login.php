<?php

$url = 'http://127.0.0.1:8000/api/auth/login';
$data = [
    'email' => 'budi@student.sch.id',
    'password' => 'password123'
];

$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n" .
                     "Accept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$headers = $http_response_header;

echo "Response Headers:\n";
print_r($headers);
echo "\nResponse Body:\n";
echo $result;
