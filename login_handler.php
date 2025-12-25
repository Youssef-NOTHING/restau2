<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validate input
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Enter a valid email address.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

try {
    $db = getDatabase();
    $stmt = $db->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'No account found with this email. Please sign up first.']);
        exit;
    }
    
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Incorrect password. Please try again.']);
        exit;
    }
    
    // Set session
    $_SESSION['client_id'] = $user['id'];
    $_SESSION['client_name'] = $user['name'];
    $_SESSION['client_email'] = $user['email'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Welcome back, ' . $user['name'] . '. You are now signed in.',
        'client' => [
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
?>
