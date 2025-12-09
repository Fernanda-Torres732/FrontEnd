import React, { useEffect, useState } from "react";
import {
  listarEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from "../Service/ReservasService";

export const EmpleadoComponent = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    idEmpleado: null,
    nombre: "",
    puesto: "",
    password: ""
  });

  const [modoEditar, setModoEditar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await listarEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error("Error cargando empleados:", error);
    }
  };

  const validarFormulario = () => {
    const errs = {};

    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.puesto.trim()) errs.puesto = "El puesto es obligatorio";

    // Password obligatorio solo al crear
    if (!modoEditar && !form.password.trim())
      errs.password = "La contraseña es obligatoria";

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      let dataToSend = { ...form };

      // Si edita y no cambia password, no enviar el campo
      if (modoEditar && !form.password.trim()) {
        delete dataToSend.password;
      }

      if (modoEditar) {
        await actualizarEmpleado(form.idEmpleado, dataToSend);
      } else {
        await crearEmpleado(dataToSend);
      }

      setForm({ idEmpleado: null, nombre: "", puesto: "", password: "" });
      setModoEditar(false);
      cargarEmpleados();
    }  catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Ocurrió un error al guardar el tipo");
    }
  };

  const handleEditar = (empleado) => {
    setForm({ ...empleado, password: "" }); // evitar mostrar password real
    setModoEditar(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este empleado?")) {
      try {
        await eliminarEmpleado(id);
        cargarEmpleados();
      } catch (error) {
        console.error("Error eliminando empleado:", error);
      }
    }
  };

  const empleadosFiltrados = empleados.filter((e) =>
    `${e.nombre} ${e.puesto}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gestión de Empleados
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
        <label className="form-label fw-semibold">Nombre *</label>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
         
        />
        {errores.nombre && <small className="text-danger">{errores.nombre}</small>}

        <label className="form-label fw-semibold mt-3">Puesto *</label>
        <input
          type="text"
          name="puesto"
          placeholder="Puesto"
          value={form.puesto}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
      
        />
        {errores.puesto && <small className="text-danger">{errores.puesto}</small>}

        {/* Password */}
        <label className="form-label fw-semibold mt-3">
          Contraseña {modoEditar ? "(opcional)" : "*"}
        </label>
        <input
          type="password"
          name="password"
          placeholder={modoEditar ? "Déjalo vacío para no cambiar" : "Contraseña"}
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        {errores.password && <small className="text-danger">{errores.password}</small>}

        <div className="flex items-center">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              modoEditar ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            {modoEditar ? "Actualizar" : "Agregar"}
          </button>

          {modoEditar && (
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
              onClick={() => {
                setForm({ idEmpleado: null, nombre: "", puesto: "", password: "" });
                setModoEditar(false);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <table className="table table-kawaii w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Puesto</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-3">
                No se encontraron empleados
              </td>
            </tr>
          ) : (
            empleadosFiltrados.map((e) => (
              <tr key={e.idEmpleado}>
                <td className="border p-2">{e.idEmpleado}</td>
                <td className="border p-2">{e.nombre}</td>
                <td className="border p-2">{e.puesto}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditar(e)}
                    className="btn-edit mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(e.idEmpleado)}
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
