// apiHelper.js
export const API_GATEWAY = "http://localhost:7070"; 
export const API_PRIN = "https://reservas-4472428832.us-central1.run.app/api";
export const API_EMPLEADOS = "https://reservas-4472428832.us-central1.run.app/api/empleados";
export const API_CLIENTES = "https://soothing-expression-production-62f7.up.railway.app/api/cliente";
export const API_PRODUCTO = "http://localhost:7070/api/producto";
export const API_TIPO = "http://localhost:7070/api/tipo";
export const API_VENTA = "http://localhost:7070/api/venta";
export const API_DETALLE_VENTA = "http://localhost:7070/api/detalleventa";

// Helper universal con manejo de token y errores
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Error en API:", response.status, text);
    throw new Error(`Error ${response.status}: ${text || "Error desconocido"}`);
  }

  // si la respuesta está vacía (DELETE), devolvemos null
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
