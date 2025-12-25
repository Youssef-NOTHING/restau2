<?php
require_once 'config.php';

header('Content-Type: application/json');

if (isset($_SESSION['client_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'restau' => [
            'name' => $_SESSION['client_name'],
            'email' => $_SESSION['client_email']
        ]
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
