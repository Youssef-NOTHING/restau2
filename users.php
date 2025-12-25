<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maison Lumiere | Admin - Users</title>
  <link rel="stylesheet" href="styles/main.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    .admin-container {
      max-width: 1000px;
      margin: 80px auto 40px;
      padding: 30px;
    }
    
    .admin-header {
      margin-bottom: 30px;
    }
    
    .admin-header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #ffffff 0%, var(--text-muted) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .users-table {
      background: var(--panel);
      border-radius: var(--radius);
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }
    
    .table-header {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr 1.5fr;
      gap: 15px;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.04);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr 1.5fr;
      gap: 15px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      align-items: center;
    }
    
    .table-row:last-child {
      border-bottom: none;
    }
    
    .table-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    
    .user-id {
      color: var(--accent);
      font-weight: 600;
    }
    
    .user-name {
      color: var(--text);
    }
    
    .user-email {
      color: var(--text-muted);
      font-size: 13px;
    }
    
    .user-date {
      color: var(--text-muted);
      font-size: 13px;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      color: var(--text-muted);
    }
    
    .error {
      background: rgba(245, 98, 98, 0.1);
      border: 1px solid rgba(245, 98, 98, 0.3);
      border-radius: 12px;
      padding: 20px;
      color: #f56262;
      margin-bottom: 20px;
    }
    
    .user-count {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 10px;
    }
    
    .back-btn {
      display: inline-block;
      margin-bottom: 20px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      color: var(--text-muted);
      cursor: pointer;
      text-decoration: none;
      font-size: 13px;
      transition: all 0.3s ease;
    }
    
    .back-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text);
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="logo">Maison Lumiere</div>
    <button class="nav-toggle" aria-label="Toggle navigation">
      <span></span><span></span>
    </button>
    <nav class="main-nav">
      <a href="index.html#hero">Home</a>
      <a href="menu.html">Menu</a>
      <a href="index.html#info">Info</a>
      <a href="index.html#contact">Visit</a>
      <a class="login-link" href="login.html" aria-label="Login">
        <span class="nav-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </span>
        <span>Login</span>
      </a>
    </nav>
    <button class="cart-toggle" aria-label="Shopping cart">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span class="cart-count">0</span>
    </button>
  </header>

  <main>
    <div class="admin-container">
      <a href="index.html" class="back-btn">← Back to Home</a>
      
      <div class="admin-header">
        <h1>Registered Users</h1>
        <p class="muted">View all users registered in the system</p>
      </div>

      <div id="content">
        <div class="loading">Loading users...</div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="foot-left">
      <div class="logo">Maison Lumiere</div>
      <p class="muted">Seasonal kitchen. Low lights. High touch.</p>
    </div>
    <div class="foot-right">
      <p>Hours: Tue–Sun, 5:30–11:30 PM</p>
      <p>214 Lantern Street, District 7</p>
      <div class="socials">
        <a href="#" aria-label="Instagram">Instagram</a>
        <a href="#" aria-label="Newsletter">Newsletter</a>
      </div>
    </div>
  </footer>

  <script src="scripts/main.js"></script>
  <script>
    async function loadUsers() {
      try {
        const response = await fetch('get_users.php');
        const data = await response.json();
        const content = document.getElementById('content');
        
        if (!data.success) {
          content.innerHTML = `<div class="error">${data.message}</div>`;
          return;
        }
        
        if (data.users.length === 0) {
          content.innerHTML = '<div class="error">No users found in database</div>';
          return;
        }
        
        let html = '<div class="users-table"><div class="table-header">';
        html += '<div>ID</div><div>Name</div><div>Email</div><div>Phone</div><div>City</div><div>Registered</div>';
        html += '</div>';
        
        data.users.forEach(user => {
          const date = new Date(user.created_at).toLocaleDateString();
          const phone = user.phone || '-';
          const city = user.city || '-';
          html += `<div class="table-row">
            <div class="user-id">#${user.id}</div>
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-email" style="font-size:12px;">${phone}</div>
            <div class="user-email" style="font-size:12px;">${city}</div>
            <div class="user-date">${date}</div>
          </div>`;
        });
        
        html += '</div>';
        html += `<div class="user-count">Total Users: ${data.total}</div>`;
        content.innerHTML = html;
      } catch (e) {
        document.getElementById('content').innerHTML = '<div class="error">Error loading users: ' + e.message + '</div>';
      }
    }
    
    loadUsers();
  </script>
</body>
</html>
