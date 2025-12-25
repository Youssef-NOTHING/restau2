const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const filterButtons = document.querySelectorAll('.chip');
const menuCards = document.querySelectorAll('.menu-card');
const form = document.getElementById('reserveForm');
const formMessage = document.getElementById('formMessage');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const cartToggle = document.querySelector('.cart-toggle');
const cartPanel = document.querySelector('.cart-panel');
const cartOverlay = document.querySelector('.cart-overlay');
const cartClose = document.querySelector('.cart-close');
const cartItemsContainer = document.querySelector('.cart-items');

let cartCount = 0;
let cartItems = [];

function toggleNav() {
  nav.classList.toggle('open');
}

function closeNav() {
  nav.classList.remove('open');
}

if (navToggle) {
  navToggle.addEventListener('click', toggleNav);
}

nav?.addEventListener('click', (evt) => {
  if (evt.target.tagName === 'A') {
    closeNav();
  }
});

// Cart functionality
function toggleCart() {
  cartPanel.classList.toggle('open');
  cartOverlay.classList.toggle('open');
}

function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('open');
}

if (cartToggle) {
  cartToggle.addEventListener('click', toggleCart);
}

if (cartClose) {
  cartClose.addEventListener('click', closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener('click', closeCart);
}

function updateCartDisplay() {
  const cartBadge = document.querySelector('.cart-count');
  if (cartBadge) {
    cartBadge.textContent = cartCount;
  }
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cartItemsContainer.innerHTML = cartItems.map((item, idx) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price}</div>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem(${idx})">×</button>
      </div>
    `).join('');
  }
  
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
  document.querySelector('.total-price').textContent = '$' + total.toFixed(2);
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  cartCount--;
  updateCartDisplay();
  showToast('Item removed from cart');
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (evt) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      evt.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    menuCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || filter === category;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

// Buy Now functionality
document.querySelectorAll('.buy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.menu-card');
    const dishName = card.querySelector('h3').textContent;
    const dishPrice = card.querySelector('.price').textContent;
    const dishImage = card.querySelector('.menu-img').src;
    
    cartItems.push({
      name: dishName,
      price: dishPrice,
      image: dishImage
    });
    
    cartCount++;
    updateCartDisplay();
    
    showToast(`${dishName} added to cart!`);
  });
});

// Details functionality
document.querySelectorAll('.details-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.menu-card');
    const dishName = card.querySelector('h3').textContent;
    const dishTag = card.querySelector('.tag').textContent;
    const dishPrice = card.querySelector('.price').textContent;
    const dishImg = card.querySelector('.menu-img').src;
    
    showDetailsModal(dishName, dishTag, dishPrice, dishImg);
  });
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showDetailsModal(name, category, price, image) {
  // Remove existing modal if any
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <button class="modal-close">&times;</button>
    <div class="modal-content">
      <img src="${image}" alt="${name}" class="modal-image">
      <div class="modal-body">
        <span class="modal-tag">${category}</span>
        <h2>${name}</h2>
        <p class="modal-price">${price}</p>
        <p class="modal-description">Expertly prepared with premium ingredients. Our chefs craft each dish with care and precision, bringing flavors that delight the palate.</p>
        <button class="modal-buy-btn">Add to Cart</button>
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Close modal functionality
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => overlay.remove());
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  
  // Add to cart from modal
  const modalBuyBtn = modal.querySelector('.modal-buy-btn');
  modalBuyBtn.addEventListener('click', () => {
    cartItems.push({
      name: name,
      price: price,
      image: image
    });
    
    cartCount++;
    updateCartDisplay();
    showToast(`${name} added to cart!`);
    overlay.remove();
  });
}

function validateForm(data) {
  const errors = [];
  if (!data.name.trim()) errors.push('Name is required.');
  if (!data.email.trim() || !data.email.includes('@')) errors.push('Valid email required.');
  if (!data.date) errors.push('Date is required.');
  if (!data.time) errors.push('Time is required.');
  if (data.guests < 1) errors.push('Guests must be at least 1.');
  return errors;
}

form?.addEventListener('submit', (evt) => {
  evt.preventDefault();
  formMessage.textContent = '';

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    date: formData.get('date') || '',
    time: formData.get('time') || '',
    guests: Number(formData.get('guests') || 0),
    notes: formData.get('notes') || '',
  };

  const errors = validateForm(payload);
  if (errors.length) {
    formMessage.textContent = errors.join(' ');
    formMessage.style.color = '#f56262';
    return;
  }

  formMessage.style.color = '#6ce0c7';
  formMessage.textContent = 'Request received! We will confirm by email within the hour.';
  form.reset();
});

const fadeItems = document.querySelectorAll('.menu-card, .story, .reserve-card, .contact-card, .contact-map, .info-card, .auth-card');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

fadeItems.forEach((item) => observer.observe(item));

// PHP-based authentication functions
async function checkSession() {
  try {
    const response = await fetch('check_session.php');
    const data = await response.json();
    return data.loggedIn ? data.user : null;
  } catch (e) {
    console.warn('Unable to check session', e);
    return null;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch('login_handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn('Login request failed', e);
    return { success: false, message: 'Connection error. Please try again.' };
  }
}

async function logoutUser() {
  try {
    const response = await fetch('logout_handler.php');
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn('Logout request failed', e);
    return { success: false, message: 'Connection error.' };
  }
}

async function signupUser(name, email, password, confirmPassword, phone, address, city, postalCode, dietaryPreferences) {
  try {
    const response = await fetch('signup_handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, confirmPassword, phone, address, city, postalCode, dietaryPreferences })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn('Signup request failed', e);
    return { success: false, message: 'Connection error. Please try again.' };
  }
}

async function updateHeaderForUser() {
  const user = await checkSession();
  const loginLinks = document.querySelectorAll('.login-link');
  
  if (user) {
    loginLinks.forEach((link) => {
      link.innerHTML = `
        <span class="profile-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </span>
        <span class="profile-name">${user.name}</span>
      `;
      link.href = '#';
      link.classList.add('profile-link');
      link.setAttribute('title', user.email);
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showProfileModal(user);
      });
    });
  }
}

function showProfileModal(user) {
  const existing = document.querySelector('.profile-modal-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.className = 'profile-modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'profile-modal';
  modal.innerHTML = `
    <button class="modal-close">&times;</button>
    <div class="profile-modal-content">
      <div class="profile-avatar">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <h2>${user.name}</h2>
      <p class="profile-email">${user.email}</p>
      <button class="btn primary logout-btn">Sign Out</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => overlay.remove());
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  
  const logoutBtn = modal.querySelector('.logout-btn');
  logoutBtn.addEventListener('click', async () => {
    const result = await logoutUser();
    if (result.success) {
      showToast('Signed out successfully');
      overlay.remove();
      window.location.href = 'index.html';
    }
  });
}

updateHeaderForUser();

loginForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  loginMessage.textContent = '';

  const formData = new FormData(loginForm);
  const email = (formData.get('email') || '').toString().trim();
  const password = (formData.get('password') || '').toString();

  if (!email || !email.includes('@')) {
    loginMessage.textContent = 'Enter a valid email address.';
    loginMessage.style.color = '#f56262';
    return;
  }

  if (password.length < 6) {
    loginMessage.textContent = 'Password must be at least 6 characters.';
    loginMessage.style.color = '#f56262';
    return;
  }

  const result = await loginUser(email, password);

  if (!result.success) {
    loginMessage.style.color = '#f56262';
    loginMessage.textContent = result.message;
    return;
  }

  loginMessage.style.color = '#6ce0c7';
  loginMessage.textContent = result.message;
  showToast('Signed in successfully');
  loginForm.reset();
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

const signupForm = document.getElementById('signupForm');
const signupMessage = document.getElementById('signupMessage');

signupForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  signupMessage.textContent = '';

  const formData = new FormData(signupForm);
  const name = (formData.get('name') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const password = (formData.get('password') || '').toString();
  const confirmPassword = (formData.get('confirmPassword') || '').toString();
  const phone = (formData.get('phone') || '').toString().trim();
  const address = (formData.get('address') || '').toString().trim();
  const city = (formData.get('city') || '').toString().trim();
  const postalCode = (formData.get('postalCode') || '').toString().trim();
  const dietaryPreferences = (formData.get('dietaryPreferences') || '').toString().trim();
  const termsChecked = formData.get('terms');

  if (!name || name.length < 2) {
    signupMessage.textContent = 'Name must be at least 2 characters.';
    signupMessage.style.color = '#f56262';
    return;
  }

  if (!email || !email.includes('@')) {
    signupMessage.textContent = 'Enter a valid email address.';
    signupMessage.style.color = '#f56262';
    return;
  }

  if (password.length < 6) {
    signupMessage.textContent = 'Password must be at least 6 characters.';
    signupMessage.style.color = '#f56262';
    return;
  }

  if (password !== confirmPassword) {
    signupMessage.textContent = 'Passwords do not match.';
    signupMessage.style.color = '#f56262';
    return;
  }

  if (!termsChecked) {
    signupMessage.textContent = 'Please agree to the terms and conditions.';
    signupMessage.style.color = '#f56262';
    return;
  }

  const result = await signupUser(name, email, password, confirmPassword, phone, address, city, postalCode, dietaryPreferences);

  if (!result.success) {
    signupMessage.style.color = '#f56262';
    signupMessage.textContent = result.message;
    return;
  }

  signupMessage.style.color = '#6ce0c7';
  signupMessage.textContent = result.message;
  showToast('Account created successfully!');
  signupForm.reset();
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

updateHeaderForUser();
