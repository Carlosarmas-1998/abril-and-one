/* ============================================
   A B R I L  &  O N E — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- Mobile menu ----
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  let overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
  }

  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) toggleMenu();
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Scroll reveal (Intersection Observer) ----
  initScrollReveal();

  // ---- Current year in footer ----
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Newsletter form ----
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value) {
        if (typeof AO_ANALYTICS !== 'undefined') AO_ANALYTICS.registrarSuscripcion(input.value);
        input.value = '';
        alert('¡Gracias por suscribirte a A B R I L  &  O N E!');
      }
    });
  }

  // ---- Contact form ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      const success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
    });
  }

  // ---- CART SIDEBAR ----
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const creditToggle = document.getElementById('creditOneToggle');

  function openCart() {
    if (!cartSidebar) return;
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  }

  function closeCart() {
    if (!cartSidebar) return;
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Policy accept checkbox
  const policyAccept = document.getElementById('policyAccept');
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (policyAccept && checkoutBtn) {
    policyAccept.addEventListener('change', () => {
      checkoutBtn.disabled = !policyAccept.checked;
    });
    checkoutBtn.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
      if (cart.length === 0) return;
      const esCredito = creditToggle && creditToggle.checked;
      let total = 0;
      const productos = [];
      cart.forEach(id => {
        const p = PRODUCTS.find(pr => pr.id === id);
        if (p) {
          total += p.precio;
          if (!productos.find(x => x.id === p.id)) productos.push({ id: p.id, nombre: p.nombre });
        }
      });
      if (typeof AO_ANALYTICS !== 'undefined') {
        const pedidoId = AO_ANALYTICS.registrarPedido(productos, total, esCredito);
        localStorage.removeItem('abrilone_cart');
        updateCartCount();
        alert('¡Pedido ' + pedidoId + ' realizado con éxito!\n\n' +
          (esCredito ? 'Pago inicial: L. ' + Math.ceil(total/2) + '\nPendiente 24h antes: L. ' + (total - Math.ceil(total/2)) : 'Total pagado: L. ' + total) +
          '\n\nTe contactaremos por correo para coordinar la entrega.');
        closeCart();
        policyAccept.checked = false;
        checkoutBtn.disabled = true;
      }
    });
  }

  // Crédito ONE toggle
  if (creditToggle) {
    creditToggle.addEventListener('change', () => {
      const breakdown = document.getElementById('creditBreakdown');
      if (creditToggle.checked) {
        breakdown.classList.add('show');
      } else {
        breakdown.classList.remove('show');
      }
      updateCartTotals();
    });
  }
});

// ---- CART FUNCTIONS ----
function renderCartItems() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  if (!cartItemsEl) return;

  const cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');

  if (cart.length === 0) {
    cartItemsEl.style.display = 'none';
    cartEmpty.style.display = 'flex';
    cartFooter.classList.remove('show');
    return;
  }

  cartItemsEl.style.display = 'block';
  cartEmpty.style.display = 'none';
  cartFooter.classList.add('show');

  // Count quantities
  const counts = {};
  cart.forEach(id => { counts[id] = (counts[id] || 0) + 1; });

  cartItemsEl.innerHTML = '';
  Object.keys(counts).forEach(id => {
    const product = PRODUCTS.find(p => p.id === parseInt(id));
    if (!product) return;
    const qty = counts[id];
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <div class="cart-item-color" style="background: ${product.gradient};"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${product.nombre}</div>
        <div class="cart-item-cat">${product.categoria}</div>
        <div class="cart-item-price">L. ${product.precio.toLocaleString('es-HN')} ${qty > 1 ? '× ' + qty : ''}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${product.id})" aria-label="Eliminar">×</button>
    `;
    cartItemsEl.appendChild(item);
  });

  updateCartTotals();
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
  const idx = cart.indexOf(productId);
  if (idx > -1) cart.splice(idx, 1);
  localStorage.setItem('abrilone_cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

function updateCartTotals() {
  const cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
  let subtotal = 0;
  cart.forEach(id => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) subtotal += product.precio;
  });

  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const creditNow = document.getElementById('creditNow');
  const creditLater = document.getElementById('creditLater');
  const creditToggle = document.getElementById('creditOneToggle');

  if (subtotalEl) subtotalEl.textContent = 'L. ' + subtotal.toLocaleString('es-HN');
  if (totalEl) totalEl.textContent = 'L. ' + subtotal.toLocaleString('es-HN');

  if (creditToggle && creditToggle.checked) {
    const half = Math.ceil(subtotal / 2);
    const otherHalf = subtotal - half;
    if (creditNow) creditNow.textContent = 'L. ' + half.toLocaleString('es-HN');
    if (creditLater) creditLater.textContent = 'L. ' + otherHalf.toLocaleString('es-HN');
  }
}

// ---- Global scroll reveal function ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => {
    observer.observe(el);
  });
}
