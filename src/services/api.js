import {
  API_GATEWAY,
  API_EMPLEADOS,
  API_CLIENTES,
  API_PRODUCTO,
  API_TIPO,
  API_VENTA,
  API_DETALLE_VENTA,
  apiFetch,
} from "../Service/apiHelper";


// --- CLIENTES ---
export async function listarClientes() {
  return apiFetch(`${API_CLIENTES}`);
}

export async function crearCliente(data) {
  return apiFetch(`${API_CLIENTES}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarCliente(id, data) {
  return apiFetch(`${API_CLIENTES}/${id}/actualizar`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function desactivarCliente(id) {
  return apiFetch(`${API_CLIENTES}/${id}/desactivar`, { method: "PUT" });
}

// --- PRODUCTOS ---
export async function listarProductos() {
  return apiFetch(`${API_PRODUCTO}`);
}

export async function crearProducto(data) {
  return apiFetch(`${API_PRODUCTO}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarProducto(id, data) {
  return apiFetch(`${API_PRODUCTO}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function desactivarProducto(id) {
  return apiFetch(`${API_PRODUCTO}/${id}/desactivar`, { method: "PUT" });
}

// --- TIPOS ---
export async function listarTipos() {
  return apiFetch(`${API_TIPO}`);
}

export async function crearTipo(data) {
  return apiFetch(`${API_TIPO}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarTipo(id, data) {
  return apiFetch(`${API_TIPO}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarTipo(id) {
  return apiFetch(`${API_TIPO}/${id}`, { method: "DELETE" });
}

// --- EMPLEADOS ---
export async function listarEmpleados() {
  return apiFetch(`${API_EMPLEADOS}`);
}

export async function crearEmpleado(data) {
  return apiFetch(`${API_EMPLEADOS}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarEmpleado(id, data) {
  return apiFetch(`${API_EMPLEADOS}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarEmpleado(id) {
  return apiFetch(`${API_EMPLEADOS}/${id}`, { method: "DELETE" });
}
// --- VENTAS ---
export async function listarVentas() {
  return apiFetch(`${API_VENTA}`);
}

export async function crearVenta(data) {
  return apiFetch(`${API_VENTA}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarVenta(id, data) {
  return apiFetch(`${API_VENTA}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarVenta(id) {
  return apiFetch(`${API_VENTA}/${id}`, { method: "DELETE" });
}

// --- DETALLE VENTAS ---
export async function listarDetalleVenta() {
  return apiFetch(`${API_DETALLE_VENTA}`);
}

export async function crearDetalleVenta(data) {
  return apiFetch(`${API_DETALLE_VENTA}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarDetalleVenta(id, data) {
  return apiFetch(`${API_DETALLE_VENTA}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarDetalleVenta(id) {
  return apiFetch(`${API_DETALLE_VENTA}/${id}`, { method: "DELETE" });
}
