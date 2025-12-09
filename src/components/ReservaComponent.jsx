import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarReservas,
  crearReserva,
  listarMesas,
  actualizarReserva,
  eliminarReserva,
  confirmarReserva,
  cancelarReserva,
} from "../Service/ReservasService";
import { listarClientes } from "../services/api";
import { useAuth } from "../auth/AuthContext";
export const ReservaComponent = () => {
  const navigate = useNavigate();

  // 🧩 Estados principales
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const { user } = useAuth();
  const rol = user?.rol;
  const [form, setForm] = useState({
    idReserva: null,
    fecha: "",
    hora: "",
    idCliente: "",
    idMesa: "",
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [errores, setErrores] = useState({});
  // 📦 Cargar reservas, clientes y mesas
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [dataReservas, dataClientes, dataMesas] = await Promise.all([
          listarReservas(),
          listarClientes(),
          listarMesas(),
        ]);

        const reservasConDetalles = dataReservas.map((r) => {
          const cliente = dataClientes.find((c) => c.id === r.idCliente);
          const mesa = dataMesas.find((m) => m.idMesa === r.idMesa);
          return {
            ...r,
            nombreCliente: cliente ? cliente.nombreCliente : "Desconocido",
            ubicacionMesa: mesa ? mesa.ubicacion : "No definida",
          };
        });
        let visibles = reservasConDetalles;

        // 👉 Si es CLIENTE, solo ver las suyas
        if (rol === "CLIENTE") {
          visibles = reservasConDetalles.filter(
            (r) => r.idCliente === user.idCliente || r.idCliente === user.id
          );
        }

        setReservas(visibles);
        setReservasFiltradas(visibles);

        setClientes(dataClientes);
        setMesas(dataMesas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarTodo();
  }, []);
  const validarFormulario = () => {
    const errs = {};

    if (!form.fecha.trim()) errs.fecha = "El nombre es obligatorio";
    if (!form.hora.trim()) errs.hora = "El puesto es obligatorio";
    if (!form.idCliente.trim()) errs.idCliente = "El puesto es obligatorio";
    if (!form.idMesa.trim()) errs.idMesa = "El puesto es obligatorio";

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };
  // 🔍 Filtrar reservas por fecha exacta
  useEffect(() => {
    if (filtroFecha === "") {
      setReservasFiltradas(reservas);
    } else {
      const filtradas = reservas.filter(
        (r) => r.fecha === filtroFecha
      );
      setReservasFiltradas(filtradas);
    }
  }, [filtroFecha, reservas]);

  // 🎯 Manejo de formulario
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    if (rol === "CLIENTE") {
      form.idCliente = user.idCliente || user.id;
    }
    try {
      if (modoEditar) {
        await actualizarReserva(form.idReserva, form);
      } else {
        await crearReserva(form);
      }

      setForm({ idReserva: null, fecha: "", hora: "", idCliente: "", idMesa: "" });
      setModoEditar(false);
      const data = await listarReservas();
      setReservas(data);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Ocurrió un error al guardar el tipo");
    }
  };

  const handleEditar = (reserva) => {
    setForm(reserva);
    setModoEditar(true);
  };

  const handleConfirmar = async (id) => {
    try {
      await confirmarReserva(id);
      const data = await listarReservas();
      setReservas(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm("¿Seguro que deseas cancelar esta reserva?")) {
      try {
        await cancelarReserva(id);
        const data = await listarReservas();
        setReservas(data);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // 🧾 Render
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <label className="form-label fw-semibold">Fecha de la reserva *</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errores.fecha && <small className="text-danger">{errores.fecha}</small>}
        <label className="form-label fw-semibold">Hora de la reserva *</label>
        <input
          type="time"
          name="hora"
          value={form.hora}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errores.hora && <small className="text-danger">{errores.hora}</small>}

        <label className="form-label fw-semibold">Cliente *</label>
        {rol !== "CLIENTE" ? (
          // 🔹 Select para ADMIN/CAJERO
          <select
            name="idCliente"
            value={form.idCliente}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCliente}
              </option>
            ))}
          </select>
        ) : (
          // 🔹 Campo bloqueado para CLIENTE
          <input
            type="text"
            value={user.nombreCliente}
            disabled
            className="w-full p-2 border rounded bg-gray-200"
          />
        )}

        {errores.idCliente && <small className="text-danger">{errores.idCliente}</small>}


        <label className="form-label fw-semibold">Mesa *</label>
        <select
          name="idMesa"
          value={form.idMesa}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona una mesa </option>
          {mesas.map((m) => (
            <option key={m.idMesa} value={m.idMesa}>
              {m.ubicacion}
            </option>
          ))}
        </select>
        {errores.idMesa && <small className="text-danger">{errores.idMesa}</small>}
        <button
          type="submit"
          className={`mt-3 px-4 py-2 text-white rounded ${modoEditar ? "bg-blue-500" : "bg-green-500"
            }`}
        >
          {modoEditar ? "Actualizar" : "Agregar"}
        </button>

        {modoEditar && (
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => {
              setForm({ idReserva: null, fecha: "", hora: "", idCliente: "", idMesa: "" });
              setModoEditar(false);
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      {/* ⭐ TABLA SOLO PARA CLIENTE (SÍEMPRE FUERA DEL BLOQUE) */}
{rol === "CLIENTE" && (
  <table className="table table-kawaii mb-4">
    <thead>
      <tr className="bg-gray-200">
        <th className="border p-2">Fecha</th>
        <th className="border p-2">Hora</th>
        <th className="border p-2">Mesa</th>
        <th className="border p-2">Estatus</th>
      </tr>
    </thead>
    <tbody>
      {reservas.map((r) => (
        <tr key={r.idReserva}>
          <td className="border p-2">{r.fecha}</td>
          <td className="border p-2">{r.hora}</td>
          <td className="border p-2">{r.ubicacionMesa}</td>
          <td className="border p-2">
            {r.estatus === 2 ? "Confirmada" : "Pendiente"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

{/* ⭐ RESTO SOLO PARA ADMIN / CAJERO */}
{rol !== "CLIENTE" && (
  <>
    {/* filtros, tabla completa, acciones */}
  </>
)}

      {/* 🔍 Filtro por fecha */}
      {rol !== "CLIENTE" && (
        <>
          <div className="card p-3 mb-4 shadow-sm">
            <div className="mb-4">
              <h5 className="fw-semibold mb-2">Filtrar por fecha :u</h5>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="border p-2 rounded"
              />
              {filtroFecha && (
                <button
                  className="ml-2 px-3 py-1 bg-gray-400 text-white rounded"
                  onClick={() => setFiltroFecha("")}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Tabla */}

          <table className="table table-kawaii">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Hora</th>
                <th className="border p-2">Cliente</th>
                <th className="border p-2">Mesa</th>
                <th className="border p-2">Estatus</th>
                {(rol === "ADMIN" || rol === "CAJERO") && (
                  <>
                    <th className="border p-2">Acciones</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((r) => {
                const fechaReserva = new Date(r.fecha);
                const fechaHoy = new Date();
                const esHoy =
                  fechaReserva.toISOString().split("T")[0] ===
                  fechaHoy.toISOString().split("T")[0];
                const yaPaso = fechaReserva < fechaHoy && !esHoy;

                return (
                  <tr key={r.idReserva} className={r.estatus === 2 ? "bg-green-100" : ""}>
                    <td className="border p-2">{r.idReserva}</td>
                    <td className="border p-2">{r.fecha}</td>
                    <td className="border p-2">{r.hora}</td>
                    <td className="border p-2">{r.nombreCliente}</td>
                    <td className="border p-2">{r.ubicacionMesa}</td>
                    <td className="border p-2">
                      {r.estatus === 2 ? "Confirmada" : "Pendiente"}
                    </td>
                    {(rol === "ADMIN" || rol === "CAJERO") && (
                      <>
                        <td className="border p-2">
                          {!yaPaso && (
                            <button onClick={() => handleEditar(r)} className="btn-edit">
                              Editar
                            </button>
                          )}
                          {r.estatus !== 2 && (
                            <button onClick={() => handleConfirmar(r.idReserva)} className="btn-edit">
                              Confirmar
                            </button>
                          )}
                          {r.estatus === 2 && esHoy && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/ventas?idReserva=${r.idReserva}&idCliente=${r.idCliente}&nombreCliente=${encodeURIComponent(
                                    r.nombreCliente
                                  )}`
                                )
                              }
                              className="btn-edit"
                            >
                              Adjuntar Venta
                            </button>
                          )}
                          {r.estatus !== 2 && (
                            <button onClick={() => handleCancelar(r.idReserva)} className="btn-delete">
                              Cancelar
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>

  );
};
