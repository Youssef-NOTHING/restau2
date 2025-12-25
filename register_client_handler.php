<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$clientName = trim($input['clientName'] ?? '');
$clientNo = trim($input['clientNo'] ?? '');
$clientAddress = trim($input['clientAddress'] ?? '');
$clientEmail = trim($input['clientEmail'] ?? '');

// Validate input
if (empty($clientName)) {
    echo json_encode(['success' => false, 'message' => 'Client name is required.']);
    exit;
}

if (empty($clientNo)) {
    echo json_encode(['success' => false, 'message' => 'Client number is required.']);
    exit;
}

if (empty($clientEmail) || !filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Valid email address is required.']);
    exit;
}

try {
    $db = getDatabase();
    
    // Check if client number already exists
    $stmt = $db->prepare("SELECT id FROM client WHERE client_no = ?");
    $stmt->execute([$clientNo]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Client number already exists.']);
        exit;
    }
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM client WHERE client_email = ?");
    $stmt->execute([$clientEmail]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered as a client.']);
        exit;
    }
    
    // Create new client
    $stmt = $db->prepare("INSERT INTO client (client_name, client_no, client_address, client_email) VALUES (?, ?, ?, ?)");
    $stmt->execute([$clientName, $clientNo, $clientAddress, $clientEmail]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Client registered successfully!',
        'client' => [
            'name' => $clientName,
            'no' => $clientNo,
            'email' => $clientEmail
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error registering client. Please try again.']);
}
?>
