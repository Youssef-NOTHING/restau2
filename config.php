<?php
// MySQL Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'restau');

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Initialize database
function getDatabase() {
    try {
        $db = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        
        // Create users table if not exists
        $db->exec("CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            address VARCHAR(255),
            city VARCHAR(100),
            postal_code VARCHAR(20),
            dietary_preferences TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        
        // Check if we need to seed demo users
        $stmt = $db->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] == 0) {
            // Seed demo users
            $stmt = $db->prepare("INSERT INTO users (name, email, password, phone, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute(['Guest', 'guest@maison.com', password_hash('taste123', PASSWORD_DEFAULT), '(415) 555-0147', '123 Demo St', 'San Francisco', '94102']);
            $stmt->execute(['Demo Diner', 'demo@maison.com', password_hash('demo123', PASSWORD_DEFAULT), '(415) 555-0148', '456 Test Ave', 'San Francisco', '94103']);
        }
        
        return $db;
    } catch (PDOException $e) {
        die(json_encode(['success' => false, 'message' => 'Database connection error. Please check your MySQL configuration.']));
    }
}
?>
