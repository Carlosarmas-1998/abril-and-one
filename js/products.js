/* ============================================
   A B R I L  &  O N E — Product Data & Rendering
   ============================================ */

const PRODUCTS = [
  {
    id: 1,
    nombre: "Velvet Rose Matte",
    categoria: "labiales",
    precio: 299,
    descripcion: "Tu primer paso hacia lo extraordinario.",
    lema: "Para la mujer que no pide permiso para brillar.",
    manifiesto: "Este labial no es solo color. Es una declaración. Formulado con pigmentos de alta definición y manteca de karité pura, Velvet Rose Matte se funde con tus labios como una segunda piel. Un acabado aterciopelado que desafía las horas, que resiste el café de la mañana y las sonrisas de la noche. Porque tú no te retocas — tú permaneces.",
    imagen: "labial.png",
    badge: "Exclusivo"
  }
];

// Messages for categories in development
const CREANDO_CATS = {
  rimel: {
    titulo: "Rímel",
    subtitulo: "Creando la mirada que habla sin palabras",
    desc: "Estamos formulando un rímel que entiende tus pestañas. Fibras inteligentes, volumen real, cero grumos. Cada pestaña será una declaración de intención.",
    icono: "👁"
  },
  sombras: {
    titulo: "Sombras",
    subtitulo: "Creando los colores que aún no existen",
    desc: "Paletas diseñadas para romper reglas. Pigmentos que se funden como seda, tonos que nacen del amanecer y la medianoche. Pronto en tus manos.",
    icono: "✨"
  },
  delineadores: {
    titulo: "Delineadores",
    subtitulo: "Creando la línea perfecta para cada historia",
    desc: "Precisión milimétrica. Fórmula waterproof. Un trazo que define quién eres. Estamos perfeccionando cada detalle para que tu mirada sea inolvidable.",
    icono: "🖊"
  }
};

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card product-card-featured scroll-reveal';
  card.setAttribute('data-category', product.categoria);
  card.innerHTML = `
    <div class="product-img product-img-real" onclick="openProductModal(${product.id})" style="cursor:pointer;">
      <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
    </div>
    <div class="product-info">
      <p class="product-category">${product.categoria}</p>
      <h3 class="product-name">${product.nombre}</h3>
      <p class="product-lema">${product.lema}</p>
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

  card.querySelector('.add-cart-btn').addEventListener('click', (e) => {
    const qty = parseInt(qtyEl.textContent);
    addToCart(product.id, e, qty);
    qtyEl.textContent = '1';
  });

  return card;
}

// ---- PRODUCT MODAL ----
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Remove existing modal
  const existing = document.getElementById('productModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'productModal';
  modal.className = 'product-modal';
  modal.innerHTML = `
    <div class="product-modal-overlay" onclick="closeProductModal()"></div>
    <div class="product-modal-content">
      <button class="product-modal-close" onclick="closeProductModal()" aria-label="Cerrar">&times;</button>
      <div class="product-modal-img">
        <img src="${product.imagen}" alt="${product.nombre}">
      </div>
      <div class="product-modal-info">
        <span class="product-modal-badge">${product.badge || ''}</span>
        <h2 class="product-modal-name">${product.nombre}</h2>
        <p class="product-modal-lema">${product.lema}</p>
        <div class="product-modal-divider"></div>
        <p class="product-modal-manifiesto">${product.manifiesto}</p>
        <div class="product-modal-divider"></div>
        <div class="product-modal-footer">
          <span class="product-modal-price">L. ${product.precio.toLocaleString('es-HN')}</span>
          <div class="product-modal-actions">
            <div class="qty-selector">
              <button class="qty-btn qty-minus" onclick="modalQtyChange(-1)" aria-label="Menos">−</button>
              <span class="qty-value" id="modalQty">1</span>
              <button class="qty-btn qty-plus" onclick="modalQtyChange(1)" aria-label="Más">+</button>
            </div>
            <button class="add-cart-btn" onclick="modalAddToCart(${product.id})">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.classList.add('active'));
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => modal.remove(), 300);
}

function modalQtyChange(delta) {
  const el = document.getElementById('modalQty');
  if (!el) return;
  let val = parseInt(el.textContent) + delta;
  if (val < 1) val = 1;
  if (val > 20) val = 20;
  el.textContent = val;
}

function modalAddToCart(productId) {
  const qtyEl = document.getElementById('modalQty');
  const qty = qtyEl ? parseInt(qtyEl.textContent) : 1;
  addToCart(productId, null, qty);
  closeProductModal();
}

// ---- CREANDO CATEGORY VIEW ----
function renderCreandoCategory(container, cat) {
  const info = CREANDO_CATS[cat];
  if (!info) return;

  container.innerHTML = `
    <div class="creando-cat-card scroll-reveal">
      <div class="creando-cat-bg">
        <div class="creando-particle"></div>
        <div class="creando-particle"></div>
        <div class="creando-particle"></div>
      </div>
      <div class="creando-cat-content">
        <span class="creando-cat-icon">${info.icono}</span>
        <p class="creando-cat-label">En Desarrollo</p>
        <h3 class="creando-cat-title">${info.subtitulo}</h3>
        <div class="creando-cat-divider"></div>
        <p class="creando-cat-desc">${info.desc}</p>
        <p class="creando-cat-footer">A B R I L & O N E — Pronto para ti</p>
      </div>
    </div>
  `;
  initScrollReveal();
}

function renderProducts(container, products) {
  container.innerHTML = '';
  products.forEach(p => container.appendChild(createProductCard(p)));
  initScrollReveal();
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  renderProducts(grid, PRODUCTS);
}

function renderCatalog(filter) {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  // If it's a "creando" category, show the elegant coming soon
  if (CREANDO_CATS[filter]) {
    renderCreandoCategory(grid, filter);
    return;
  }

  const filtered = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.categoria === filter);
  renderProducts(grid, filtered);
}

function addToCart(productId, e, qty) {
  qty = qty || 1;
  let cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
  for (let i = 0; i < qty; i++) cart.push(productId);
  localStorage.setItem('abrilone_cart', JSON.stringify(cart));
  updateCartCount();

  const product = PRODUCTS.find(p => p.id === productId);
  if (product && typeof AO_ANALYTICS !== 'undefined') {
    AO_ANALYTICS.registrarProductoAgregado(productId, product.nombre, product.categoria, product.precio);
  }

  if (product) showCartToast(product.nombre, qty);

  if (e && e.target) {
    const btn = e.target.closest('.add-cart-btn') || e.target;
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

function showCartToast(nombre, qty) {
  const existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
    <span><strong>${nombre}</strong> ×${qty} agregado al carrito</span>
  `;
  document.body.appendChild(toast);
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

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam && document.getElementById('categoriasSection')) {
    showCategory(catParam);
  }
});
