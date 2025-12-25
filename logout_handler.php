<?php
require_once 'config.php';

header('Content-Type: application/json');

// Destroy session
session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Signed out successfully']);
?>
