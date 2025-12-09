const API_RESERVAS = "https://reservas-4472428832.us-central1.run.app/api/reservas";
const API_MESAS = "https://reservas-4472428832.us-central1.run.app/api/mesas";
const API_EMPLEADOS = "https://reservas-4472428832.us-central1.run.app/api/empleados";

// 🪑 Mesas
export async function listarMesas() {
  const res = await fetch(`${API_MESAS}`);
  if (!res.ok) throw new Error("Error al listar mesas");
  return res.json();
}

export async function crearMesa(data) {
  const res = await fetch(`${API_MESAS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear mesa");
  return res.json();
}

export async function actualizarMesa(id, data) {
  const res = await fetch(`${API_MESAS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar mesa");
  return res.json();
}

export async function eliminarMesa(id) {
  const res = await fetch(`${API_MESAS}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar mesa");
}



// 👨 Empleados
export async function listarEmpleados() {
  const res = await fetch(`${API_EMPLEADOS}`);
  if (!res.ok) throw new Error("Error al listar empleados");
  return res.json();
}

export async function crearEmpleado(data) {
  const res = await fetch(`${API_EMPLEADOS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear empleado");
  return res.json();
}

export async function actualizarEmpleado(id, data) {
  const res = await fetch(`${API_EMPLEADOS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar empleado");
  return res.json();
}

export async function eliminarEmpleado(id) {
  const res = await fetch(`${API_EMPLEADOS}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar empleado");
}


// 📅 Reservas
// Listar reservas
export async function listarReservas() {
  const res = await fetch(`${API_RESERVAS}`);
  if (!res.ok) throw new Error("Error al listar reservas");
  return res.json();
}

// Crear reserva
export async function crearReserva(data) {
  const res = await fetch(`${API_RESERVAS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear reserva");
  return res.json();
}


export async function actualizarReserva(id, data) {
  const res = await fetch(`${API_RESERVAS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar reserva");
  return res.json();
}

export async function eliminarReserva(id) {
  const res = await fetch(`${API_RESERVAS}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar reserva");
}



//  Confirmar / Cancelar Reservas
export async function confirmarReserva(id) {
  const res = await fetch(`${API_RESERVAS}/${id}/confirmar`, { method: "PUT" });
  if (!res.ok) throw new Error("Error al confirmar reserva");
  return res.json();
}

export async function cancelarReserva(id) {
  const res = await fetch(`${API_RESERVAS}/${id}/cancelar`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al cancelar reserva");
}
