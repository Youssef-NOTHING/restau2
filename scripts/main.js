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

loginForm?.addEventListener('submit', (evt) => {
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

  loginMessage.style.color = '#6ce0c7';
  loginMessage.textContent = 'Welcome back. You are now signed in.';
  showToast('Signed in successfully');
  loginForm.reset();
});
