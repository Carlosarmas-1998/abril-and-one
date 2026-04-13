/* ============================================
   A B R I L  &  O N E — Supabase Connection
   ============================================ */

const SUPABASE_URL = 'https://foglmtspevcaxkwoqveb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ2xtdHNwZXZjYXhrd29xdmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDMwNDAsImV4cCI6MjA5MTM3OTA0MH0.Ui2hErL02fh4E9PngMwpTxNeIMZSSNLD9AGxGxGJwoU';

const supabaseHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Check if email is new (first order gets 10% discount)
async function checkClienteNuevo(email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_clientes?email=eq.${encodeURIComponent(email)}&select=id,es_nuevo`, {
    headers: supabaseHeaders
  });
  const data = await res.json();
  if (data.length === 0) return { esNuevo: true, clienteId: null };
  return { esNuevo: data[0].es_nuevo, clienteId: data[0].id };
}

// Create or get client
async function getOrCreateCliente(nombre, email) {
  const check = await checkClienteNuevo(email);
  if (check.clienteId) return check;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_clientes`, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify({ nombre, email, es_nuevo: true })
  });
  const data = await res.json();
  return { esNuevo: true, clienteId: data[0].id };
}

// Save order to database
async function guardarPedido(pedidoData) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_pedidos`, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify(pedidoData)
  });
  return await res.json();
}

// Mark client as not new after first order
async function marcarClienteNoNuevo(clienteId) {
  await fetch(`${SUPABASE_URL}/rest/v1/abril_clientes?id=eq.${clienteId}`, {
    method: 'PATCH',
    headers: supabaseHeaders,
    body: JSON.stringify({ es_nuevo: false })
  });
}

// Fetch orders by client email
async function fetchPedidosPorEmail(email) {
  // First get client ID
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_clientes?email=eq.${encodeURIComponent(email)}&select=id`, {
    headers: supabaseHeaders
  });
  const clients = await res.json();
  if (clients.length === 0) return [];

  const clienteId = clients[0].id;
  const res2 = await fetch(`${SUPABASE_URL}/rest/v1/abril_pedidos?cliente_id=eq.${clienteId}&order=created_at.desc`, {
    headers: supabaseHeaders
  });
  return await res2.json();
}

// Fetch ALL orders (for gerencia)
async function fetchTodosPedidos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_pedidos?order=created_at.desc&select=*,abril_clientes(nombre,email)`, {
    headers: supabaseHeaders
  });
  return await res.json();
}

// Update order status (from gerencia)
async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  await fetch(`${SUPABASE_URL}/rest/v1/abril_pedidos?id=eq.${pedidoId}`, {
    method: 'PATCH',
    headers: supabaseHeaders,
    body: JSON.stringify({ estado: nuevoEstado })
  });
}

// ---- SOPORTE / COMUNICACIONES ----

// Send a support message
async function enviarMensajeSoporte(nombre, email, asunto, mensaje) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_soporte`, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify({ nombre, email, asunto, mensaje, estado: 'nuevo' })
  });
  return await res.json();
}

// Fetch messages by email (for client)
async function fetchMisComunicaciones(email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_soporte?email=eq.${encodeURIComponent(email)}&order=created_at.desc`, {
    headers: supabaseHeaders
  });
  return await res.json();
}

// Fetch all support messages (for gerencia)
async function fetchTodosSoporte() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/abril_soporte?order=created_at.desc`, {
    headers: supabaseHeaders
  });
  return await res.json();
}

// Respond to a support message (from gerencia)
async function responderSoporte(ticketId, respuesta) {
  await fetch(`${SUPABASE_URL}/rest/v1/abril_soporte?id=eq.${ticketId}`, {
    method: 'PATCH',
    headers: supabaseHeaders,
    body: JSON.stringify({ respuesta, estado: 'respondido', respondido_at: new Date().toISOString() })
  });
}
