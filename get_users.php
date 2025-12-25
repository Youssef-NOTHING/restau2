<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $db = getDatabase();
    
    // Get all users from database
    $stmt = $db->prepare("SELECT id, name, email, phone, address, city, postal_code, dietary_preferences, created_at FROM restau ORDER BY created_at DESC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'users' => $users,
        'total' => count($users)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching users: ' . $e->getMessage()
    ]);
}
?>
