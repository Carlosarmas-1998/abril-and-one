/* ============================================
   A B R I L  &  O N E — Sistema de Analytics
   Almacena todo en localStorage
   ============================================ */

const AO_ANALYTICS = {
  KEY: 'abrilone_analytics',

  getDB() {
    const raw = localStorage.getItem(this.KEY);
    if (raw) return JSON.parse(raw);
    return {
      visitas: [],
      suscripciones: [],
      pedidos: [],
      productosAgregados: [],
      paginasVistas: {},
      categoriasVistas: {},
      ingresos: { total: 0, creditoONE: 0, pagoCompleto: 0 },
      resumen: { totalVisitas: 0, visitasHoy: 0 }
    };
  },

  save(db) {
    localStorage.setItem(this.KEY, JSON.stringify(db));
  },

  // ---- REGISTRAR VISITA ----
  registrarVisita() {
    const db = this.getDB();
    const ahora = new Date();
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');

    const visita = {
      fecha: ahora.toISOString(),
      pagina: pagina,
      categoria: cat || null,
      referrer: document.referrer || 'directo',
      userAgent: navigator.userAgent.substring(0, 100),
      hora: ahora.toLocaleTimeString('es-HN'),
      dia: ahora.toLocaleDateString('es-HN')
    };
    db.visitas.push(visita);

    // Contador de páginas
    db.paginasVistas[pagina] = (db.paginasVistas[pagina] || 0) + 1;

    // Contador de categorías
    if (cat) {
      db.categoriasVistas[cat] = (db.categoriasVistas[cat] || 0) + 1;
    }

    db.resumen.totalVisitas++;
    this.save(db);
  },

  // ---- REGISTRAR SUSCRIPCIÓN ----
  registrarSuscripcion(email) {
    const db = this.getDB();
    db.suscripciones.push({
      email: email,
      fecha: new Date().toISOString(),
      fuente: window.location.pathname.split('/').pop() || 'index.html'
    });
    this.save(db);
  },

  // ---- REGISTRAR PRODUCTO AGREGADO AL CARRITO ----
  registrarProductoAgregado(productId, nombre, categoria, precio) {
    const db = this.getDB();
    db.productosAgregados.push({
      productoId: productId,
      nombre: nombre,
      categoria: categoria,
      precio: precio,
      fecha: new Date().toISOString()
    });
    this.save(db);
  },

  // ---- REGISTRAR PEDIDO ----
  registrarPedido(productos, total, esCredito) {
    const db = this.getDB();
    const pedido = {
      id: 'PED-' + Date.now().toString(36).toUpperCase(),
      productos: productos,
      total: total,
      metodoPago: esCredito ? 'Crédito ONE' : 'Pago completo',
      pagoInicial: esCredito ? Math.ceil(total / 2) : total,
      pagoPendiente: esCredito ? total - Math.ceil(total / 2) : 0,
      estado: esCredito ? 'Pendiente 2do pago' : 'Pagado',
      fecha: new Date().toISOString()
    };
    db.pedidos.push(pedido);

    // Actualizar ingresos
    db.ingresos.total += total;
    if (esCredito) {
      db.ingresos.creditoONE += total;
    } else {
      db.ingresos.pagoCompleto += total;
    }
    this.save(db);
    return pedido.id;
  },

  // ---- OBTENER ESTADÍSTICAS ----
  getEstadisticas() {
    const db = this.getDB();
    const hoy = new Date().toLocaleDateString('es-HN');

    const visitasHoy = db.visitas.filter(v => v.dia === hoy).length;
    const visitasUltimos7 = db.visitas.filter(v => {
      const fecha = new Date(v.fecha);
      const hace7 = new Date();
      hace7.setDate(hace7.getDate() - 7);
      return fecha >= hace7;
    }).length;

    // Productos más agregados al carrito
    const conteoProductos = {};
    db.productosAgregados.forEach(p => {
      const key = p.nombre;
      if (!conteoProductos[key]) {
        conteoProductos[key] = { nombre: p.nombre, categoria: p.categoria, precio: p.precio, veces: 0 };
      }
      conteoProductos[key].veces++;
    });
    const productosMasVendidos = Object.values(conteoProductos).sort((a, b) => b.veces - a.veces);

    // Categorías más visitadas
    const categoriasRank = Object.entries(db.categoriasVistas)
      .map(([cat, vistas]) => ({ categoria: cat, vistas }))
      .sort((a, b) => b.vistas - a.vistas);

    // Páginas más visitadas
    const paginasRank = Object.entries(db.paginasVistas)
      .map(([pag, vistas]) => ({ pagina: pag, vistas }))
      .sort((a, b) => b.vistas - a.vistas);

    // Visitas por hora
    const visitasPorHora = {};
    db.visitas.forEach(v => {
      const h = new Date(v.fecha).getHours();
      visitasPorHora[h] = (visitasPorHora[h] || 0) + 1;
    });

    // Ingresos por método
    const pedidosCredito = db.pedidos.filter(p => p.metodoPago === 'Crédito ONE');
    const pedidosPago = db.pedidos.filter(p => p.metodoPago === 'Pago completo');

    return {
      totalVisitas: db.visitas.length,
      visitasHoy,
      visitasUltimos7,
      totalSuscripciones: db.suscripciones.length,
      totalPedidos: db.pedidos.length,
      totalProductosAgregados: db.productosAgregados.length,
      ingresos: db.ingresos,
      productosMasVendidos,
      categoriasRank,
      paginasRank,
      visitasPorHora,
      pedidosCredito: pedidosCredito.length,
      pedidosPago: pedidosPago.length,
      suscripciones: db.suscripciones,
      pedidos: db.pedidos,
      ultimasVisitas: db.visitas.slice(-20).reverse()
    };
  },

  // ---- RESET ----
  resetDB() {
    localStorage.removeItem(this.KEY);
  }
};

// Auto-registrar visita al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
  AO_ANALYTICS.registrarVisita();
});
