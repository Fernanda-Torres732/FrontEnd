import React, { useEffect, useState } from "react";
import { listarMesas, crearMesa, actualizarMesa, eliminarMesa } from "../Service/ReservasService";

export const MesaComponent = () => {
  const [mesas, setMesas] = useState([]);
  const [form, setForm] = useState({ idMesa: null, numero: "", capacidad: "", ubicacion: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [errores, setErrores] = useState({});
  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      const data = await listarMesas();
      setMesas(data);
    } catch (error) {
      console.error("Error cargando mesas:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validarFormulario = () => {
    const errs = {};

    if (!form.numero.trim()) errs.numero = "El numero es obligatorio";
    if (!form.capacidad.trim()) errs.capacidad = "El capacidad es obligatorio";
    if (!form.ubicacion.trim()) errs.ubicacion = "El ubicacion es obligatorio";
   
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    try {
      if (modoEditar) {
        await actualizarMesa(form.idMesa, form);
      } else {
        await crearMesa(form);
      }
      setForm({ idMesa: null, numero: "", capacidad: "", ubicacion: "" });
      setModoEditar(false);
      cargarMesas();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Ocurrió un error al guardar el tipo");
    }
  };

  const handleEditar = (mesa) => {
    setForm(mesa);
    setModoEditar(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta mesa?")) {
      try {
        await eliminarMesa(id);
        cargarMesas();
      } catch (error) {
        console.error("Error eliminando mesa:", error);
      }
    }
  };

  return (
   <main className="w-full max-w-6xl mx-auto px-6 py-6">
  <div className="w-full max-w-5xl mx-auto">
    <h2 className="text-center mb-4">
    {modoEditar ? "Editar Mesa" : "Agregar Mesa"}
  </h2>

  <form onSubmit={handleSubmit} className="card p-4 mb-4">
    {/* 🪑 Número de mesa */}
    <div>
      <label className="form-label">Número de Mesa *</label>
      <input
        type="number"
        name="numero"
        className="form-control"
        placeholder="Ej. 12"
        value={form.numero}
        onChange={handleChange}
      />
       {errores.numero && <small className="text-danger">{errores.numero}</small>}
    </div>

    {/* 👥 Capacidad */}
    <div className="mb-3">
      <label className="form-label">Capacidad *</label>
      <input
        type="number"
        name="capacidad"
        className="form-control"
        placeholder="Ej. 4"
        value={form.capacidad}
        onChange={handleChange}
      />
      {errores.capacidad && <small className="text-danger">{errores.capacidad}</small>}
    </div>

    {/* 📍 Ubicación */}
    <div className="mb-3">
      <label className="form-label">Ubicación *</label>
      <input
        type="text"
        name="ubicacion"
        className="form-control"
        placeholder="Ej. Terraza o Interior"
        value={form.ubicacion}
        onChange={handleChange}
      />
       {errores.ubicacion && <small className="text-danger">{errores.ubicacion}</small>}
    </div>

  
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
      >
        {modoEditar ? "Actualizar Mesa" : "Agregar Mesa"}
      </button>

      {modoEditar && (
        <button
          type="submit"
          onClick={() => {
            setForm({ idMesa: null, numero: "", capacidad: "", ubicacion: "" });
            setModoEditar(false);
          }}
        >
          Cancelar
        </button>
      )}
 
  </form>

    <table className="table table-kawaii">
      <thead>
        <tr>
          <th>ID</th>
          <th>Número</th>
          <th>Capacidad</th>
          <th>Ubicación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {mesas.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center p-3">
              No hay mesas registradas
            </td>
          </tr>
        ) : (
          mesas.map((m) => (
            <tr key={m.idMesa}>
              <td className="border p-2">{m.idMesa}</td>
              <td className="border p-2">{m.numero}</td>
              <td className="border p-2">{m.capacidad}</td>
              <td className="border p-2">{m.ubicacion}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditar(m)}
                 className="btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(m.idMesa)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</main>

  );
};
