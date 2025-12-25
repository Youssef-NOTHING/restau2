<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$confirmPassword = $input['confirmPassword'] ?? '';
$phone = trim($input['phone'] ?? '');
$address = trim($input['address'] ?? '');
$city = trim($input['city'] ?? '');
$postalCode = trim($input['postalCode'] ?? '');
$dietaryPreferences = trim($input['dietaryPreferences'] ?? '');

// Validate input
if (empty($name) || strlen($name) < 2) {
    echo json_encode(['success' => false, 'message' => 'Name must be at least 2 characters.']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Enter a valid email address.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
    exit;
}

try {
    $db = getDatabase();
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'This email is already registered. Try logging in instead.']);
        exit;
    }
    
    // Create new user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (name, email, password, phone, address, city, postal_code, dietary_preferences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword, $phone, $address, $city, $postalCode, $dietaryPreferences]);
    
    // Set session
    $userId = $db->lastInsertId();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully! Welcome to Maison Lumiere, ' . $name . '.',
        'user' => [
            'name' => $name,
            'email' => $email
        ]
    ]);
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'UNIQUE constraint failed') !== false || strpos($e->getMessage(), 'Duplicate entry') !== false) {
        echo json_encode(['success' => false, 'message' => 'This email is already registered.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
    }
}
?>
