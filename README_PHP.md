# Restaurant Login System - PHP Backend

## Setup Instructions

### Requirements
- PHP 7.4 or higher
- SQLite extension enabled (usually enabled by default)

### Installation

1. **Start PHP Development Server**
   ```bash
   php -S localhost:8000
   ```

2. **Access the Application**
   - Open your browser and navigate to: `http://localhost:8000/index.html`

3. **Demo Credentials**
   - Email: `guest@maison.com` / Password: `taste123`
   - Email: `demo@maison.com` / Password: `demo123`

### Files Created

- **config.php** - Database configuration and initialization
- **login_handler.php** - Handles login requests
- **logout_handler.php** - Handles logout requests
- **check_session.php** - Checks if user is logged in
- **restaurant.db** - SQLite database (auto-created on first run)

### Database Schema

**users table:**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- password (TEXT - hashed with PASSWORD_DEFAULT)
- created_at (DATETIME)

### Security Features

- Passwords are hashed using PHP's `password_hash()` with `PASSWORD_DEFAULT`
- SQL injection prevention using prepared statements
- Session-based authentication
- Input validation on both client and server side
- CSRF protection through same-origin requests

### How It Works

1. On first run, the system creates the SQLite database and seeds demo users
2. Login form sends credentials to `login_handler.php` via fetch API
3. Server validates credentials and creates a PHP session
4. Frontend checks session status on page load via `check_session.php`
5. Profile icon appears in navigation when logged in
6. Logout calls `logout_handler.php` to destroy the session
