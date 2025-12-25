<?php
// Database configuration
define('DB_FILE', __DIR__ . '/restaurant.db');

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Initialize database
function getDatabase() {
    try {
        $db = new PDO('sqlite:' . DB_FILE);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create users table if not exists
        $db->exec("CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        
        // Check if we need to seed demo users
        $stmt = $db->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] == 0) {
            // Seed demo users
            $stmt = $db->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
            $stmt->execute(['Guest', 'guest@maison.com', password_hash('taste123', PASSWORD_DEFAULT)]);
            $stmt->execute(['Demo Diner', 'demo@maison.com', password_hash('demo123', PASSWORD_DEFAULT)]);
        }
        
        return $db;
    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }
}
?>
