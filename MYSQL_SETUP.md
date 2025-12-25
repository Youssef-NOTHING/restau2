# Restaurant Management System - MySQL Setup Guide

## Prerequisites
- PHP 7.4+ with MySQLi/PDO extension
- MySQL Server running
- Web server (Apache/Nginx) or PHP built-in server

## MySQL Database Setup

### 1. Create Database
```sql
CREATE DATABASE restaurant_db;
```

### 2. Update config.php
Edit `config.php` and update these credentials to match your MySQL setup:

```php
define('DB_HOST', 'localhost');    // MySQL host
define('DB_USER', 'root');         // MySQL username
define('DB_PASS', '');             // MySQL password
define('DB_NAME', 'restaurant_db'); // Database name
```

### 3. Run the Application

#### Option A: Using PHP Built-in Server
```bash
cd c:\Users\HP\Desktop\restau\restau2
php -S localhost:8000
```
Then visit: `http://localhost:8000/index.html`

#### Option B: Using Apache (if configured)
Place project in `htdocs` and access via `http://localhost/restau2/`

## User Management

### Database Structure
The system automatically creates the `users` table on first run:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
```

### Demo Accounts (Seeded Automatically)
- **Email:** guest@maison.com | **Password:** taste123
- **Email:** demo@maison.com | **Password:** demo123

## Features

### Sign Up (`signup.html`)
- Create new account with name, email, password
- Password confirmation matching
- Duplicate email prevention
- Terms and conditions checkbox
- Automatic login after successful registration

### Login (`login.html`)
- Email and password validation
- Specific error messages:
  - "No account found with this email" - for non-existent accounts
  - "Incorrect password" - for wrong passwords
- Redirect to home with profile icon after success

### Profile
- Profile icon appears in navigation when logged in
- Shows user name and email
- Click to view profile details
- Sign out functionality

## Files

### PHP Backend
- **config.php** - MySQL connection and database initialization
- **login_handler.php** - User authentication
- **signup_handler.php** - User registration
- **logout_handler.php** - Session termination
- **check_session.php** - Session status check

### Frontend
- **index.html** - Home page with profile support
- **login.html** - Login form with signup link
- **signup.html** - Registration form with login link
- **scripts/main.js** - Authentication API calls
- **styles/main.css** - Auth page styling

## Security Features

✓ Password hashing with `PASSWORD_DEFAULT` algorithm  
✓ Prepared statements to prevent SQL injection  
✓ PHP sessions for authenticated users  
✓ Input validation (client & server)  
✓ Duplicate email prevention  
✓ Password confirmation on signup  

## Troubleshooting

### "Database connection error"
- Check MySQL is running: `mysql -u root` in terminal
- Verify credentials in `config.php`
- Ensure `restaurant_db` exists

### "No such file" errors
- Run from project root directory
- Use full path: `php -S localhost:8000` in the project folder

### "Email already exists"
- Account already created with that email
- Use signup with different email or login with existing credentials
