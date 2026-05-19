<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    echo 'Connection successful' . PHP_EOL;
    $stmt = $pdo->query("SHOW DATABASES LIKE 'edufin_db'");
    if ($stmt->fetch()) {
        echo 'Database edufin_db exists' . PHP_EOL;
    } else {
        echo 'Database edufin_db DOES NOT exist' . PHP_EOL;
    }
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage() . PHP_EOL;
}
