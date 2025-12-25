<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $db = getDatabase();
    
    // Get all clients from database
    $stmt = $db->prepare("SELECT id, client_name, client_no, client_address, client_email, created_at FROM client ORDER BY created_at DESC");
    $stmt->execute();
    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'clients' => $clients,
        'total' => count($clients)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching clients: ' . $e->getMessage()
    ]);
}
?>
