/* ============================================
   A B R I L  &  O N E — Product Data & Rendering
   ============================================ */

const PRODUCTS = [
  {
    id: 2,
    nombre: "Nude Sensation",
    categoria: "labiales",
    precio: 299,
    descripcion: "El tono que revela tu esencia natural.",
    lema: "Menos es poder. Tu piel, elevada.",
    manifiesto: "Un nude que no te borra — te define. Pigmento sedoso que se adapta a tu tono natural, creando un efecto segunda piel con acabado satinado. Para las que saben que la elegancia no grita, susurra.",
    imagen: "labial/2.piel.png",
    imagenes: ["labial/2.piel.png", "labial/2.pielmodelo.png"],
    badge: "Nuevo"
  },
  {
    id: 3,
    nombre: "Rouge Absolute",
    categoria: "labiales",
    precio: 299,
    descripcion: "El rojo que no necesita presentación.",
    lema: "Un clásico reinventado con actitud.",
    manifiesto: "Rojo intenso, cobertura total, cero disculpas. Fórmula de larga duración con pigmentos de alta definición que capturan la luz y dominan cualquier habitación. El rojo definitivo para quien ya sabe quién es.",
    imagen: "labial/3.rojo.png",
    imagenes: ["labial/3.rojo.png", "labial/3.rojomodelo.png"],
    badge: "Nuevo"
  },
  {
    id: 4,
    nombre: "Plum Velour",
    categoria: "labiales",
    precio: 299,
    descripcion: "Profundidad y misterio en cada trazo.",
    lema: "Para las que prefieren la noche al día.",
    manifiesto: "Un púrpura envolvente con acabado velvet que transforma tu look en una experiencia. Textura cremosa, pigmento intenso y una presencia que no se olvida. Diseñado para quienes eligen lo extraordinario.",
    imagen: "labial/4.purpel.png",
    imagenes: ["labial/4.purpel.png", "labial/4.purpelmodelo.png"],
    badge: "Nuevo"
  },
  {
    id: 5,
    nombre: "Rosé Bloom",
    categoria: "labiales",
    precio: 299,
    descripcion: "Frescura y sofisticación en un solo tono.",
    lema: "El rosa que florece contigo.",
    manifiesto: "Un rosa vibrante con alma propia. Fórmula hidratante con aceite de rosa mosqueta que nutre mientras deslumbra. Color que se mantiene fresco hora tras hora, como si acabaras de aplicarlo. Fresco, femenino, imparable.",
    imagen: "labial/5.pink.png",
    imagenes: ["labial/5.pink.png", "labial/5.pinkmodelo.png"],
    badge: "Nuevo"
  }
];

// Messages for categories in development
const CREANDO_CATS = {
  rimel: {
    titulo: "Rímel",
    subtitulo: "La mirada que no necesita palabras",
    desc: "Fibra a fibra, estamos diseñando un rímel que entiende la anatomía de cada pestaña. Volumen sin peso. Definición sin esfuerzo. Una fórmula que se está creando con la misma obsesión con la que tú cuidas cada detalle de tu presencia.",
    icono: "— I —"
  },
  sombras: {
    titulo: "Sombras",
    subtitulo: "Tonos que aún no tienen nombre",
    desc: "Pigmentos que se funden como terciopelo sobre la piel. Tonos nacidos entre el amanecer dorado y la medianoche profunda. Cada paleta será una obra de arte — estamos creándola con la paciencia que merece lo extraordinario.",
    icono: "— II —"
  },
  delineadores: {
    titulo: "Delineadores",
    subtitulo: "El trazo que define quién eres",
    desc: "Precisión milimétrica. Fórmula waterproof de larga duración. Un solo trazo para transformar tu mirada en algo inolvidable. Estamos perfeccionando cada molécula porque tu mirada merece exactitud absoluta.",
    icono: "— III —"
  },
  accesorios: {
    titulo: "Accesorios",
    subtitulo: "Los detalles que completan tu ritual",
    desc: "Sacadores de cejas, encrespadores de pestañas, coletas elegantes y herramientas esenciales que elevan cada paso de tu rutina de belleza. Cada accesorio está siendo seleccionado con el mismo estándar de calidad premium que define a A B R I L & O N E.",
    icono: "— IV —"
  }
};

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card product-card-featured scroll-reveal';
  card.setAttribute('data-category', product.categoria);
  const imgs = product.imagenes && product.imagenes.length > 1 ? product.imagenes : [product.imagen];
  const hasSlider = imgs.length > 1;

  card.innerHTML = `
    <div class="product-img product-img-real" style="cursor:pointer;">
      <div class="card-slider" data-product-id="${product.id}">
        <div class="card-slider-track">
          ${imgs.map((src, i) => `<img src="${src}" alt="${product.nombre}" class="card-slide${i === 0 ? ' active' : ''}" loading="lazy">`).join('')}
        </div>
        ${hasSlider ? '<div class="card-slider-dots">' + imgs.map((_, i) => `<span class="card-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`).join('') + '</div>' : ''}
      </div>
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

  // Setup slider with auto-slide and swipe
  if (hasSlider) {
    const slider = card.querySelector('.card-slider');
    initCardSlider(slider, imgs.length, product.id);
  }

  return card;
}

function initCardSlider(slider, count, productId) {
  let current = 0;
  let autoCount = 0;
  let autoTimer = null;
  const slides = slider.querySelectorAll('.card-slide');
  const dots = slider.querySelectorAll('.card-dot');

  function goTo(idx) {
    current = ((idx % count) + count) % count;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Auto-slide 2 full cycles (4 transitions: 0→1, 1→0, 0→1, 1→0)
  function autoSlide() {
    if (autoCount >= 4) { clearInterval(autoTimer); return; }
    goTo(current + 1);
    autoCount++;
  }
  autoTimer = setInterval(autoSlide, 1800);

  // Dot clicks
  dots.forEach(d => d.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(parseInt(d.dataset.index));
    clearInterval(autoTimer);
  }));

  // Swipe support (touch)
  let startX = 0, startY = 0, isDragging = false;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    clearInterval(autoTimer);
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
      e.preventDefault();
    }
  }, { passive: false });

  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 30) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
  });

  // Click to open modal (only if not swiping)
  slider.addEventListener('click', (e) => {
    if (Math.abs(e.clientX - startX) < 10) {
      openProductModal(productId);
    }
  });

  // Mouse drag for desktop
  let mouseStartX = 0, mouseDown = false;
  slider.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseDown = true;
    clearInterval(autoTimer);
    e.preventDefault();
  });
  slider.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
  });
  slider.addEventListener('mouseup', (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    const dx = e.clientX - mouseStartX;
    if (Math.abs(dx) > 30) {
      goTo(dx < 0 ? current + 1 : current - 1);
    } else {
      openProductModal(productId);
    }
  });
  slider.addEventListener('mouseleave', () => { mouseDown = false; });
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
  const imgs = product.imagenes && product.imagenes.length > 1 ? product.imagenes : [product.imagen];
  const hasMultiple = imgs.length > 1;

  modal.innerHTML = `
    <div class="product-modal-overlay" onclick="closeProductModal()"></div>
    <div class="product-modal-content">
      <button class="product-modal-close" onclick="closeProductModal()" aria-label="Cerrar">&times;</button>
      <div class="product-modal-img">
        <div class="modal-slider">
          <div class="card-slider-track">
            ${imgs.map((src, i) => `<img src="${src}" alt="${product.nombre}" class="card-slide${i === 0 ? ' active' : ''}">`).join('')}
          </div>
          ${hasMultiple ? '<div class="card-slider-dots modal-dots">' + imgs.map((_, i) => `<span class="card-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`).join('') + '</div>' : ''}
        </div>
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

  // Init swipe on modal slider
  const modalSlider = modal.querySelector('.modal-slider');
  initModalSlider(modalSlider, imgs.length, imgs);
}

function initModalSlider(slider, count, images) {
  let current = 0;
  const slides = slider.querySelectorAll('.card-slide');
  const dots = slider.querySelectorAll('.card-dot');

  function goTo(idx) {
    current = ((idx % count) + count) % count;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.index))));

  let startX = 0, isDragging = false;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (Math.abs(e.touches[0].clientX - startX) > 20) e.preventDefault();
  }, { passive: false });
  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 30) goTo(dx < 0 ? current + 1 : current - 1);
  });

  let mouseX = 0, mouseDown = false;
  slider.addEventListener('mousedown', (e) => { mouseX = e.clientX; mouseDown = true; e.preventDefault(); });
  slider.addEventListener('mouseup', (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    const dx = e.clientX - mouseX;
    if (Math.abs(dx) > 30) {
      goTo(dx < 0 ? current + 1 : current - 1);
    } else if (images) {
      openPhotoViewer(images, current);
    }
  });
  slider.addEventListener('mouseleave', () => { mouseDown = false; });

  // Touch tap to open viewer
  slider.addEventListener('click', (e) => {
    if (e.target.classList.contains('card-dot')) return;
    if (images) openPhotoViewer(images, current);
  });
}

// ---- FULLSCREEN PHOTO VIEWER ----
function openPhotoViewer(images, startIndex) {
  const existing = document.getElementById('photoViewer');
  if (existing) existing.remove();

  let current = startIndex || 0;
  const viewer = document.createElement('div');
  viewer.id = 'photoViewer';
  viewer.className = 'photo-viewer';
  viewer.innerHTML = `
    <div class="photo-viewer-overlay"></div>
    <button class="photo-viewer-close" aria-label="Cerrar">&times;</button>
    <div class="photo-viewer-container">
      ${images.map((src, i) => `<img src="${src}" class="photo-viewer-img${i === current ? ' active' : ''}" alt="Foto ${i+1}">`).join('')}
    </div>
    ${images.length > 1 ? '<div class="photo-viewer-dots">' + images.map((_, i) => `<span class="photo-viewer-dot${i === current ? ' active' : ''}" data-index="${i}"></span>`).join('') + '</div>' : ''}
    <p class="photo-viewer-hint">Desliza para ver mas</p>
  `;

  document.body.appendChild(viewer);
  requestAnimationFrame(() => viewer.classList.add('active'));

  const viewerImgs = viewer.querySelectorAll('.photo-viewer-img');
  const viewerDots = viewer.querySelectorAll('.photo-viewer-dot');
  const hint = viewer.querySelector('.photo-viewer-hint');

  function goTo(idx) {
    current = ((idx % images.length) + images.length) % images.length;
    viewerImgs.forEach((img, i) => img.classList.toggle('active', i === current));
    viewerDots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (hint) hint.style.display = 'none';
  }

  // Close
  viewer.querySelector('.photo-viewer-close').addEventListener('click', () => closePhotoViewer());
  viewer.querySelector('.photo-viewer-overlay').addEventListener('click', () => closePhotoViewer());

  // Dots
  viewerDots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.index))));

  // Swipe (touch)
  const container = viewer.querySelector('.photo-viewer-container');
  let startX = 0, isDragging = false;
  container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (Math.abs(e.touches[0].clientX - startX) > 15) e.preventDefault();
  }, { passive: false });
  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 25) goTo(dx < 0 ? current + 1 : current - 1);
  });

  // Mouse drag
  let mouseX = 0, mouseDown = false;
  container.addEventListener('mousedown', (e) => { mouseX = e.clientX; mouseDown = true; e.preventDefault(); });
  container.addEventListener('mouseup', (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    const dx = e.clientX - mouseX;
    if (Math.abs(dx) > 30) goTo(dx < 0 ? current + 1 : current - 1);
  });
  container.addEventListener('mouseleave', () => { mouseDown = false; });

  // Auto-hide hint
  setTimeout(() => { if (hint) hint.style.opacity = '0'; }, 3000);
}

function closePhotoViewer() {
  const viewer = document.getElementById('photoViewer');
  if (!viewer) return;
  viewer.classList.remove('active');
  setTimeout(() => viewer.remove(), 300);
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

  // Hide the grid and render full-width
  container.style.display = 'none';

  // Remove previous creando section if any
  const prev = document.getElementById('creandoCatFull');
  if (prev) prev.remove();

  const section = document.createElement('div');
  section.id = 'creandoCatFull';
  section.innerHTML = `
    <div class="creando-cat-card">
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
        <p class="creando-cat-footer">A B R I L  &  O N E — Pronto para ti</p>
      </div>
    </div>
  `;
  container.parentNode.appendChild(section);
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

  // Clean up previous creando section
  const prev = document.getElementById('creandoCatFull');
  if (prev) prev.remove();
  grid.style.display = '';

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
  delineadores: 'Delineadores',
  accesorios: 'Accesorios'
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

  // Clean up creando full section
  const creandoFull = document.getElementById('creandoCatFull');
  if (creandoFull) creandoFull.remove();
  const grid = document.getElementById('catalogGrid');
  if (grid) grid.style.display = '';

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
