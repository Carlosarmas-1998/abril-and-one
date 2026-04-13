/* ============================================
   A B R I L  &  O N E — Product Data & Rendering
   ============================================ */

const PRODUCTS = [
  // LABIALES
  {
    id: 1,
    nombre: "Rouge Eternel",
    categoria: "labiales",
    precio: 489,
    descripcion: "Labial mate de larga duración con acabado aterciopelado.",
    gradient: "linear-gradient(135deg, #8B0000, #DC143C)",
    badge: "Best Seller"
  },
  {
    id: 2,
    nombre: "Nude Essence",
    categoria: "labiales",
    precio: 459,
    descripcion: "Tono nude natural con hidratación intensa.",
    gradient: "linear-gradient(135deg, #D2A68C, #E8C4B8)",
    badge: null
  },
  {
    id: 3,
    nombre: "Berry Crush",
    categoria: "labiales",
    precio: 489,
    descripcion: "Intenso tono berry con acabado cremoso.",
    gradient: "linear-gradient(135deg, #722F37, #C2185B)",
    badge: "Nuevo"
  },
  {
    id: 4,
    nombre: "Rosewood Matte",
    categoria: "labiales",
    precio: 469,
    descripcion: "Rosa antiguo con fórmula de larga duración.",
    gradient: "linear-gradient(135deg, #B5636A, #D4A0A0)",
    badge: null
  },
  // RIMEL
  {
    id: 5,
    nombre: "Volume Extreme",
    categoria: "rimel",
    precio: 399,
    descripcion: "Volumen extremo y separación perfecta.",
    gradient: "linear-gradient(135deg, #0D0D0D, #333333)",
    badge: "Best Seller"
  },
  {
    id: 6,
    nombre: "Lash Definition",
    categoria: "rimel",
    precio: 379,
    descripcion: "Define y alarga cada pestaña con precisión.",
    gradient: "linear-gradient(135deg, #1A1A2E, #16213E)",
    badge: null
  },
  {
    id: 7,
    nombre: "Waterproof Luxe",
    categoria: "rimel",
    precio: 429,
    descripcion: "Resistente al agua con cepillo de fibra.",
    gradient: "linear-gradient(135deg, #2C2C2C, #0D0D0D)",
    badge: "Nuevo"
  },
  // SOMBRAS
  {
    id: 8,
    nombre: "Golden Hour Palette",
    categoria: "sombras",
    precio: 699,
    descripcion: "Paleta de 12 tonos dorados y tierra.",
    gradient: "linear-gradient(135deg, #C9A84C, #E8D5A3)",
    badge: "Best Seller"
  },
  {
    id: 9,
    nombre: "Smokey Nights",
    categoria: "sombras",
    precio: 649,
    descripcion: "Tonos oscuros para un look dramático.",
    gradient: "linear-gradient(135deg, #2C2C2C, #696969)",
    badge: null
  },
  {
    id: 10,
    nombre: "Rose Quartz",
    categoria: "sombras",
    precio: 679,
    descripcion: "Tonos rosas y neutros con shimmer delicado.",
    gradient: "linear-gradient(135deg, #D4A0A0, #E8C4C4, #F5E6E0)",
    badge: "Nuevo"
  },
  {
    id: 11,
    nombre: "Tierra Palette",
    categoria: "sombras",
    precio: 629,
    descripcion: "Tonos tierra naturales para uso diario.",
    gradient: "linear-gradient(135deg, #8B7355, #C4A882)",
    badge: null
  },
  // DELINEADORES
  {
    id: 12,
    nombre: "Precision Noir",
    categoria: "delineadores",
    precio: 349,
    descripcion: "Punta ultra fina para trazos perfectos.",
    gradient: "linear-gradient(135deg, #0D0D0D, #1A1A1A)",
    badge: "Best Seller"
  },
  {
    id: 13,
    nombre: "Café Intenso",
    categoria: "delineadores",
    precio: 329,
    descripcion: "Marrón intenso para un look natural y sofisticado.",
    gradient: "linear-gradient(135deg, #3E2723, #6D4C41)",
    badge: null
  },
  {
    id: 14,
    nombre: "Gel Liner Duo",
    categoria: "delineadores",
    precio: 389,
    descripcion: "Delineador en gel con pincel incluido.",
    gradient: "linear-gradient(135deg, #1A1A2E, #4A4A6A)",
    badge: "Nuevo"
  },
  {
    id: 15,
    nombre: "Waterproof Liner",
    categoria: "delineadores",
    precio: 359,
    descripcion: "Resistente al agua, duración de 24 horas.",
    gradient: "linear-gradient(135deg, #212121, #424242)",
    badge: null
  },
  {
    id: 16,
    nombre: "Coral Dream",
    categoria: "labiales",
    precio: 479,
    descripcion: "Tono coral vibrante con finish luminoso.",
    gradient: "linear-gradient(135deg, #E8734A, #F4A68C)",
    badge: null
  }
];

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card scroll-reveal';
  card.setAttribute('data-category', product.categoria);
  card.innerHTML = `
    <div class="product-img" style="background: ${product.gradient};">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
    </div>
    <div class="product-info">
      <p class="product-category">${product.categoria}</p>
      <h3 class="product-name">${product.nombre}</h3>
      <p class="product-desc">${product.descripcion}</p>
      <div class="product-footer">
        <span class="product-price">L. ${product.precio.toLocaleString('es-HN')}</span>
      </div>
      <div class="product-actions">
        <div class="qty-selector">
          <button class="qty-btn qty-minus" data-id="${product.id}" aria-label="Menos">−</button>
          <span class="qty-value" id="qty-${product.id}">1</span>
          <button class="qty-btn qty-plus" data-id="${product.id}" aria-label="Más">+</button>
        </div>
        <button class="add-cart-btn" data-id="${product.id}">Agregar al carrito</button>
      </div>
    </div>
  `;

  // Qty buttons
  const minusBtn = card.querySelector('.qty-minus');
  const plusBtn = card.querySelector('.qty-plus');
  const qtyEl = card.querySelector('.qty-value');

  minusBtn.addEventListener('click', () => {
    let val = parseInt(qtyEl.textContent);
    if (val > 1) qtyEl.textContent = val - 1;
  });
  plusBtn.addEventListener('click', () => {
    let val = parseInt(qtyEl.textContent);
    if (val < 20) qtyEl.textContent = val + 1;
  });

  // Add to cart button
  card.querySelector('.add-cart-btn').addEventListener('click', (e) => {
    const qty = parseInt(qtyEl.textContent);
    addToCart(product.id, e, qty);
    qtyEl.textContent = '1'; // reset after adding
  });

  return card;
}

function renderProducts(container, products) {
  container.innerHTML = '';
  products.forEach(p => container.appendChild(createProductCard(p)));
  initScrollReveal();
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.badge === 'Best Seller');
  renderProducts(grid, featured);
}

function renderCatalog(filter) {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  const filtered = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.categoria === filter);
  renderProducts(grid, filtered);
}

function addToCart(productId, e, qty) {
  qty = qty || 1;
  let cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
  for (let i = 0; i < qty; i++) cart.push(productId);
  localStorage.setItem('abrilone_cart', JSON.stringify(cart));
  updateCartCount();

  // Analytics: registrar producto agregado
  const product = PRODUCTS.find(p => p.id === productId);
  if (product && typeof AO_ANALYTICS !== 'undefined') {
    AO_ANALYTICS.registrarProductoAgregado(productId, product.nombre, product.categoria, product.precio);
  }

  // Show toast notification
  if (product) showCartToast(product.nombre, qty);

  // Button animation feedback
  if (e && e.target) {
    const btn = e.target.closest('.add-cart-btn') || e.target;
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

function showCartToast(nombre, qty) {
  // Remove existing toast if any
  const existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
    <span><strong>${nombre}</strong> ×${qty} agregado al carrito</span>
  `;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = cart.length;
    if (cart.length > 0) {
      countEl.classList.add('show');
    } else {
      countEl.classList.remove('show');
    }
  }
}

// ---- CATEGORY VIEW (productos.html) ----
const CAT_NAMES = {
  labiales: 'Labiales',
  rimel: 'Rímel',
  sombras: 'Sombras',
  delineadores: 'Delineadores'
};

function showCategory(cat, e) {
  if (e) e.preventDefault();
  const catSection = document.getElementById('categoriasSection');
  const prodSection = document.getElementById('productosSection');
  const catTitle = document.getElementById('catTitle');
  if (!catSection || !prodSection) return;

  catSection.style.display = 'none';
  prodSection.style.display = 'block';
  catTitle.textContent = CAT_NAMES[cat] || cat;
  renderCatalog(cat);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAllCategories() {
  const catSection = document.getElementById('categoriasSection');
  const prodSection = document.getElementById('productosSection');
  if (!catSection || !prodSection) return;

  prodSection.style.display = 'none';
  catSection.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  updateCartCount();

  // Check URL params for direct category link
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam && document.getElementById('categoriasSection')) {
    showCategory(catParam);
  }
});
