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

  // ---- Contact form → Supabase (with file uploads) ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const asunto = document.getElementById('asunto')?.value;
      const mensaje = document.getElementById('mensaje')?.value.trim();

      if (!nombre || !email || !asunto || !mensaje) return;

      const btn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      try {
        // Upload files first
        let adjuntos = [];
        const fileInput = document.getElementById('soporteFiles');
        if (fileInput && fileInput.files.length > 0) {
          const progressEl = document.getElementById('uploadProgress');
          const progressBar = document.getElementById('uploadProgressBar');
          const progressText = document.getElementById('uploadProgressText');
          if (progressEl) progressEl.style.display = 'block';

          const files = Array.from(fileInput.files);
          for (let i = 0; i < files.length; i++) {
            if (progressText) progressText.textContent = `Subiendo ${i + 1} de ${files.length}...`;
            if (progressBar) progressBar.style.width = `${((i + 1) / files.length) * 100}%`;
            const uploaded = await uploadSoporteFile(files[i]);
            adjuntos.push(uploaded);
          }
        }

        if (typeof enviarMensajeSoporte === 'function') {
          await enviarMensajeSoporte(nombre, email, asunto, mensaje, adjuntos);
        }
        contactForm.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.classList.add('show');
        const progressEl = document.getElementById('uploadProgress');
        if (progressEl) progressEl.style.display = 'none';
      } catch(err) {
        alert('Error al enviar. Intenta de nuevo.');
        btn.disabled = false;
        btn.textContent = 'Enviar Mensaje';
        const progressEl = document.getElementById('uploadProgress');
        if (progressEl) progressEl.style.display = 'none';
      }
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
  window.closeCart = closeCart;

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Policy accept checkbox
  const policyAccept = document.getElementById('policyAccept');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Email discount check
  const clienteEmail = document.getElementById('clienteEmail');
  let discountApplied = false;
  let emailTimeout = null;

  if (clienteEmail) {
    clienteEmail.addEventListener('input', () => {
      clearTimeout(emailTimeout);
      emailTimeout = setTimeout(async () => {
        const email = clienteEmail.value.trim();
        if (!email || !email.includes('@')) return;

        // Show address fields after email is entered
        const addrFields = document.getElementById('addressFields');
        if (addrFields) addrFields.style.display = 'block';

        try {
          const result = await checkClienteNuevo(email);
          const badge = document.getElementById('discountBadge');
          const discountRow = document.getElementById('discountRow');
          if (result.esNuevo) {
            discountApplied = true;
            if (badge) badge.style.display = 'flex';
            if (discountRow) discountRow.style.display = 'flex';
          } else {
            discountApplied = false;
            if (badge) badge.style.display = 'none';
            if (discountRow) discountRow.style.display = 'none';
          }
          updateCartTotals();
        } catch(e) { /* silently fail */ }
      }, 600);
    });
  }

  if (policyAccept && checkoutBtn) {
    policyAccept.addEventListener('change', () => {
      checkoutBtn.disabled = !policyAccept.checked;
    });
    checkoutBtn.addEventListener('click', async () => {
      const cart = JSON.parse(localStorage.getItem('abrilone_cart') || '[]');
      if (cart.length === 0) return;

      const nombre = document.getElementById('clienteNombre')?.value.trim();
      const email = document.getElementById('clienteEmail')?.value.trim();
      const depto = document.getElementById('clienteDepto')?.value;
      const ciudad = document.getElementById('clienteCiudad')?.value.trim();
      const colonia = document.getElementById('clienteColonia')?.value.trim();
      const direccionExacta = document.getElementById('clienteDireccion')?.value.trim();

      if (!nombre || !email || !email.includes('@')) {
        alert('Por favor ingresa tu nombre y correo electrónico.');
        return;
      }
      if (!depto) {
        alert('Por favor selecciona tu departamento.');
        return;
      }

      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Procesando...';

      const esCredito = creditToggle && creditToggle.checked;
      let subtotal = 0;
      const productos = [];
      cart.forEach(id => {
        const p = PRODUCTS.find(pr => pr.id === id);
        if (p) {
          subtotal += p.precio;
          if (!productos.find(x => x.id === p.id)) productos.push({ id: p.id, nombre: p.nombre });
        }
      });

      const descuento = discountApplied ? Math.round(subtotal * 0.10) : 0;
      const total = subtotal - descuento;

      try {
        // Save client to DB
        const cliente = await getOrCreateCliente(nombre, email);

        // Generate order ID
        const pedidoId = 'PED-' + Date.now();

        // Save order to DB
        await guardarPedido({
          pedido_id: pedidoId,
          cliente_id: cliente.clienteId,
          productos: productos,
          subtotal: subtotal,
          descuento: descuento,
          total: total,
          es_credito: esCredito,
          pago_inicial: esCredito ? Math.ceil(total / 2) : total,
          pago_pendiente: esCredito ? total - Math.ceil(total / 2) : 0,
          estado: 'pendiente',
          direccion: { departamento: depto, ciudad: ciudad || '', colonia: colonia || '', direccion: direccionExacta || '' }
        });

        // Mark client as no longer new
        if (discountApplied && cliente.clienteId) {
          await marcarClienteNoNuevo(cliente.clienteId);
        }

        // Analytics
        if (typeof AO_ANALYTICS !== 'undefined') {
          AO_ANALYTICS.registrarPedido(productos, total, esCredito);
        }

        localStorage.removeItem('abrilone_cart');
        updateCartCount();

        let msg = '¡Pedido ' + pedidoId + ' realizado con éxito!\n\n';
        if (descuento > 0) msg += '¡Se aplicó 10% de descuento por ser tu primera compra!\n';
        msg += esCredito
          ? 'Pago inicial: L. ' + Math.ceil(total / 2) + '\nPendiente 24h antes: L. ' + (total - Math.ceil(total / 2))
          : 'Total: L. ' + total;
        msg += '\n\nTe contactaremos a ' + email + ' para coordinar la entrega.';

        alert(msg);
        closeCart();
        policyAccept.checked = false;
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Finalizar Compra';
        document.getElementById('clienteNombre').value = '';
        document.getElementById('clienteEmail').value = '';
        discountApplied = false;
        document.getElementById('discountBadge').style.display = 'none';
        document.getElementById('discountRow').style.display = 'none';
      } catch (err) {
        alert('Hubo un error al procesar tu pedido. Intenta de nuevo.');
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Finalizar Compra';
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
      <div class="cart-item-img" onclick="if(typeof openProductModal==='function'){closeCart();openProductModal(${product.id});}">
        ${product.imagen
          ? `<img src="${product.imagen}" alt="${product.nombre}">`
          : `<div class="cart-item-color-dot" style="background: ${product.gradient};"></div>`
        }
      </div>
      <div class="cart-item-info" onclick="if(typeof openProductModal==='function'){closeCart();openProductModal(${product.id});}">
        <div class="cart-item-name">${product.nombre}</div>
        <div class="cart-item-cat">${product.categoria}</div>
        <div class="cart-item-price">L. ${product.precio.toLocaleString('es-HN')} ${qty > 1 ? '<span class="cart-item-qty">× ' + qty + '</span>' : ''}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${product.id})" aria-label="Eliminar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
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

  // Check if discount badge is visible (discount applied)
  const discountBadge = document.getElementById('discountBadge');
  const hasDiscount = discountBadge && discountBadge.style.display !== 'none';
  const descuento = hasDiscount ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal - descuento;

  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const discountEl = document.getElementById('cartDiscount');
  const creditNow = document.getElementById('creditNow');
  const creditLater = document.getElementById('creditLater');
  const creditToggle = document.getElementById('creditOneToggle');

  if (subtotalEl) subtotalEl.textContent = 'L. ' + subtotal.toLocaleString('es-HN');
  if (discountEl) discountEl.textContent = '- L. ' + descuento.toLocaleString('es-HN');
  if (totalEl) totalEl.textContent = 'L. ' + total.toLocaleString('es-HN');

  if (creditToggle && creditToggle.checked) {
    const half = Math.ceil(total / 2);
    const otherHalf = total - half;
    if (creditNow) creditNow.textContent = 'L. ' + half.toLocaleString('es-HN');
    if (creditLater) creditLater.textContent = 'L. ' + otherHalf.toLocaleString('es-HN');
  }
}

// ---- Address field progressive reveal ----
function showNextField(fieldId) {
  const el = document.getElementById(fieldId);
  if (el && el.style.display === 'none') {
    el.style.display = '';
    el.focus();
  }
}

// ---- Order History ----
const ESTADO_COLORS = {
  pendiente: '#f39c12',
  confirmado: '#3498db',
  enviado: '#9b59b6',
  entregado: '#27ae60',
  cancelado: '#e74c3c'
};

async function showCommunications() {
  const historyEl = document.getElementById('cartHistory');
  if (!historyEl) return;

  if (historyEl.style.display !== 'none') {
    historyEl.style.display = 'none';
    return;
  }

  const email = document.getElementById('clienteEmail')?.value.trim();
  if (!email || !email.includes('@')) {
    alert('Ingresa tu correo electrónico para ver tus comunicaciones.');
    document.getElementById('clienteEmail')?.focus();
    return;
  }

  historyEl.style.display = 'block';
  historyEl.innerHTML = '<p style="text-align:center;color:var(--gris);font-size:0.8rem;padding:16px;">Cargando...</p>';

  try {
    const [pedidos, mensajes] = await Promise.all([
      fetchPedidosPorEmail(email),
      typeof fetchMisComunicaciones === 'function' ? fetchMisComunicaciones(email) : []
    ]);

    let html = '';

    if (pedidos.length > 0) {
      html += '<p class="cart-form-label" style="margin-bottom:8px;">Mis Pedidos</p>';
      html += pedidos.map(p => `
        <div class="history-order">
          <div class="history-order-header">
            <strong>${p.pedido_id}</strong>
            <span class="history-status" style="background:${ESTADO_COLORS[p.estado] || '#999'}">${p.estado.toUpperCase()}</span>
          </div>
          <div class="history-order-details">
            <span>L. ${Number(p.total).toLocaleString('es-HN')}</span>
            ${p.descuento > 0 ? `<span style="color:#16a34a;">(-10%)</span>` : ''}
          </div>
          <div class="history-order-date">${new Date(p.created_at).toLocaleDateString('es-HN')}</div>
        </div>
      `).join('');
    }

    if (mensajes.length > 0) {
      html += '<p class="cart-form-label" style="margin:12px 0 8px;">Mis Mensajes</p>';
      html += mensajes.map(m => `
        <div class="history-order">
          <div class="history-order-header">
            <strong>${m.asunto}</strong>
            <span class="history-status" style="background:${m.estado === 'respondido' ? '#27ae60' : '#f39c12'}">${m.estado === 'respondido' ? 'RESPONDIDO' : 'PENDIENTE'}</span>
          </div>
          ${m.respuesta ? `<div style="background:#f0fdf4;padding:8px;border-radius:6px;margin-top:6px;font-size:0.78rem;color:#166534;"><strong>Respuesta:</strong> ${m.respuesta}</div>` : ''}
          <div class="history-order-date">${new Date(m.created_at).toLocaleDateString('es-HN')}</div>
        </div>
      `).join('');
    }

    if (!html) {
      html = '<p style="text-align:center;color:var(--gris);font-size:0.8rem;padding:16px;">No hay comunicaciones con este correo.</p>';
    }

    historyEl.innerHTML = html;
  } catch (e) {
    historyEl.innerHTML = '<p style="text-align:center;color:#e74c3c;font-size:0.8rem;padding:16px;">Error al cargar.</p>';
  }
}

// ---- Mis Comunicaciones (contacto page) ----
async function cargarComunicaciones() {
  const email = document.getElementById('comEmail')?.value.trim();
  const container = document.getElementById('comunicacionesResult');
  if (!email || !email.includes('@') || !container) {
    alert('Ingresa tu correo electrónico.');
    return;
  }

  container.innerHTML = '<p style="text-align:center;color:var(--gris);font-size:0.8rem;">Cargando...</p>';

  try {
    // Fetch both support messages AND orders
    const [mensajes, pedidos] = await Promise.all([
      fetchMisComunicaciones(email),
      fetchPedidosPorEmail(email)
    ]);

    let html = '';

    // Orders section
    if (pedidos.length > 0) {
      html += '<h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:12px;">Mis Pedidos</h3>';
      html += pedidos.map(p => `
        <div class="com-card">
          <div class="com-card-header">
            <strong>${p.pedido_id}</strong>
            <span class="com-status" style="background:${ESTADO_COLORS[p.estado] || '#999'}">${p.estado.toUpperCase()}</span>
          </div>
          <div class="com-card-body">
            <span>Total: <strong>L. ${Number(p.total).toLocaleString('es-HN')}</strong></span>
            ${p.descuento > 0 ? '<span style="color:#16a34a;"> (10% desc. aplicado)</span>' : ''}
            <span style="color:var(--gris-light);font-size:0.75rem;"> — ${new Date(p.created_at).toLocaleDateString('es-HN')}</span>
          </div>
          ${p.es_credito ? `<div class="com-card-credit">Crédito ONE — Pago inicial: L. ${Number(p.pago_inicial).toLocaleString('es-HN')} | Pendiente: L. ${Number(p.pago_pendiente).toLocaleString('es-HN')}</div>` : ''}
        </div>
      `).join('');
    }

    // Support messages section
    if (mensajes.length > 0) {
      html += '<h3 style="font-family:var(--font-display);font-size:1.3rem;margin:24px 0 12px;">Mis Mensajes</h3>';
      html += mensajes.map(m => `
        <div class="com-card">
          <div class="com-card-header">
            <strong>${m.asunto}</strong>
            <span class="com-status" style="background:${m.estado === 'respondido' ? '#27ae60' : '#f39c12'}">${m.estado === 'respondido' ? 'RESPONDIDO' : 'PENDIENTE'}</span>
          </div>
          <div class="com-card-body">
            <p style="color:var(--gris);font-size:0.83rem;">${m.mensaje}</p>
          </div>
          ${m.respuesta ? `<div class="com-card-response"><strong>Respuesta de A B R I L & O N E:</strong><p>${m.respuesta}</p></div>` : ''}
          <div style="font-size:0.7rem;color:var(--gris-light);margin-top:6px;">${new Date(m.created_at).toLocaleDateString('es-HN')}</div>
        </div>
      `).join('');
    }

    if (!html) {
      html = '<p style="text-align:center;color:var(--gris);font-size:0.85rem;">No encontramos comunicaciones con este correo.</p>';
    }

    container.innerHTML = html;
  } catch(e) {
    container.innerHTML = '<p style="text-align:center;color:#e74c3c;font-size:0.85rem;">Error al cargar. Intenta de nuevo.</p>';
  }
}

// ---- File Upload Preview ----
function handleFileSelect(files) {
  const previewList = document.getElementById('filePreviewList');
  if (!previewList) return;

  Array.from(files).forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} es demasiado grande (max 10MB)`);
      return;
    }

    const item = document.createElement('div');
    item.className = 'file-preview-item';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        item.innerHTML = `
          <img src="${e.target.result}" alt="${file.name}">
          <span class="file-preview-name">${file.name}</span>
          <button class="file-preview-remove" onclick="removeFilePreview(this, '${file.name}')" aria-label="Quitar">&times;</button>
        `;
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      item.innerHTML = `
        <div class="file-preview-video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <span class="file-preview-name">${file.name}</span>
        <button class="file-preview-remove" onclick="removeFilePreview(this, '${file.name}')" aria-label="Quitar">&times;</button>
      `;
    }

    previewList.appendChild(item);
  });
}

function removeFilePreview(btn, fileName) {
  const item = btn.closest('.file-preview-item');
  if (item) item.remove();

  // Remove from file input (recreate it since FileList is read-only)
  const input = document.getElementById('soporteFiles');
  if (!input) return;
  const dt = new DataTransfer();
  Array.from(input.files).forEach(f => {
    if (f.name !== fileName) dt.items.add(f);
  });
  input.files = dt.files;
}

// ---- Cart Communications Toggle ----
function toggleCartCommunications() {
  const content = document.getElementById('cartComContent');
  if (!content) return;
  content.classList.toggle('show');
}

async function loadCartCommunications() {
  const email = document.getElementById('comEmailCart')?.value.trim();
  const result = document.getElementById('cartComResult');
  if (!email || !email.includes('@') || !result) {
    alert('Ingresa tu correo electrónico.');
    return;
  }

  result.innerHTML = '<p style="text-align:center;color:var(--gris);font-size:0.75rem;padding:8px;">Cargando...</p>';

  try {
    const [pedidos, mensajes] = await Promise.all([
      typeof fetchPedidosPorEmail === 'function' ? fetchPedidosPorEmail(email) : [],
      typeof fetchMisComunicaciones === 'function' ? fetchMisComunicaciones(email) : []
    ]);

    let html = '';

    if (pedidos.length > 0) {
      html += '<p class="cart-form-label" style="margin:8px 0 6px;">Mis Pedidos</p>';
      html += pedidos.map(p => `
        <div class="history-order">
          <div class="history-order-header">
            <strong>${p.pedido_id}</strong>
            <span class="history-status" style="background:${ESTADO_COLORS[p.estado] || '#999'}">${p.estado.toUpperCase()}</span>
          </div>
          <div class="history-order-details">
            <span>L. ${Number(p.total).toLocaleString('es-HN')}</span>
            ${p.descuento > 0 ? '<span style="color:#16a34a;">(-10%)</span>' : ''}
          </div>
          <div class="history-order-date">${new Date(p.created_at).toLocaleDateString('es-HN')}</div>
        </div>
      `).join('');
    }

    if (mensajes.length > 0) {
      html += '<p class="cart-form-label" style="margin:8px 0 6px;">Mis Mensajes</p>';
      html += mensajes.map(m => `
        <div class="history-order">
          <div class="history-order-header">
            <strong>${m.asunto}</strong>
            <span class="history-status" style="background:${m.estado === 'respondido' ? '#27ae60' : '#f39c12'}">${m.estado === 'respondido' ? 'RESPONDIDO' : 'PENDIENTE'}</span>
          </div>
          ${m.respuesta ? '<div style="background:#f0fdf4;padding:6px 8px;border-radius:6px;margin-top:4px;font-size:0.72rem;color:#166534;"><strong>R:</strong> ' + m.respuesta + '</div>' : ''}
          <div class="history-order-date">${new Date(m.created_at).toLocaleDateString('es-HN')}</div>
        </div>
      `).join('');
    }

    if (!html) {
      html = '<p style="text-align:center;color:var(--gris);font-size:0.75rem;padding:8px;">No hay comunicaciones con este correo.</p>';
    }

    result.innerHTML = html;
  } catch (e) {
    result.innerHTML = '<p style="text-align:center;color:#e74c3c;font-size:0.75rem;padding:8px;">Error al cargar.</p>';
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
