import React, { useEffect, useState } from "react";
import {
  listarTipos,
  crearTipo,
  actualizarTipo,
  eliminarTipo,
} from "../Service/TipoProductoService";

export const TipoProductoComponent = () => {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ idTipo: null, tipo: "", descripcion: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [errores, setErrores] = useState({})
  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      const data = await listarTipos();
      setTipos(data);
    } catch (error) {
      console.error("Error cargando tipos:", error);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!form.tipo.trim()) {
      nuevosErrores.tipo = "El nombre del tipo es obligatorio";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    try {
      if (modoEditar) {
        await actualizarTipo(form.idTipo, {
          tipo: form.tipo,
          descripcion: form.descripcion,
        });
      } else {
        await crearTipo({
          tipo: form.tipo,
          descripcion: form.descripcion,
        });
      }
      setForm({ idTipo: null, tipo: "", descripcion: "" });
      setModoEditar(false);
      cargarTipos();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Ocurrió un error al guardar el tipo");
    }
  };

  const handleEditar = (tipo) => {
    setForm(tipo);
    setModoEditar(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este tipo?")) {
      try {
        await eliminarTipo(id);
        cargarTipos();
      } catch (error) {
        console.error("Error eliminando tipo:", error);
      }
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tipos de Producto </h1>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <label className="form-label fw-semibold">Nombre del tipo *</label>
        <input
          type="text"
          name="tipo"
          placeholder="Nombre del tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errores.tipo && <small className="text-danger">{errores.tipo}</small>}

        <label className="form-label fw-semibold">Descripcion del tipo </label>
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <label className="form-label fw-semibold"> </label>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded ${modoEditar ? "bg-blue-500" : "bg-green-500"
            }`}
        >
          {modoEditar ? "Actualizar" : "Agregar"}
        </button>
        {modoEditar && (
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => {
              setForm({ idTipo: null, tipo: "", descripcion: "" });
              setModoEditar(false);
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      <label className="form-label fw-semibold"> </label>
      <table className="table table-kawaii">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-3">
                No hay tipos registrados
              </td>
            </tr>
          ) : (
            tipos.map((t) => (
              <tr key={t.idTipo}>
                <td className="border p-2">{t.idTipo}</td>
                <td className="border p-2">{t.tipo}</td>
                <td className="border p-2">{t.descripcion}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEditar(t)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(t.idTipo)}
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
  );

};
export default TipoProductoComponent;