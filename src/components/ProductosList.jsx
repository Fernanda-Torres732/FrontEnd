import { useEffect, useState } from "react";
import {
  listarProductos,
  desactivarProducto,
  actualizarProducto,
  crearProducto,
} from "../services/api";
import { listarTipos } from "../Service/TipoProductoService";
import { useAuth } from "../auth/AuthContext";
export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    idTipo: "",
    imagen: "",

  });
  const [modoEditar, setModoEditar] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [tipos, setTipos] = useState([]);
  const { user } = useAuth();
  const rol = user?.rol;
  const [errores, setErrores] = useState({});

  // 🔎 Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // 🔹 Cargar tipos de producto
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

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del producto es obligatorio";
    }

    if (!form.precio || parseFloat(form.precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor que 0";
    }

    if (!form.idTipo) {
      nuevosErrores.idTipo = "Debes seleccionar un tipo de producto";
    }

    if (form.imagen.trim() !== "") {
      const urlRegex = /^(http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(form.imagen)) {
        nuevosErrores.imagen = "Ingresa una URL válida";
      }
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  // 🔹 Cargar productos desde la API
  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  // 🔹 useEffect para cargar datos al inicio
  useEffect(() => {
    cargarProductos();
    cargarTipos();
  }, []);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      if (modoEditar) {
        await actualizarProducto(idEdit, form);
        alert("✅ Producto actualizado correctamente");
      } else {
        await crearProducto(form);
        alert("✅ Producto agregado correctamente");
      }

      await cargarProductos();
      setModoEditar(false);
      setForm({ nombre: "", descripcion: "", precio: "", idTipo: "", imagen: "" });
      setErrores({});
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Ocurrió un error al guardar el producto");
    }
  };


  // 🔹 Desactivar producto
  const handleDelete = async (id) => {
    if (confirm("¿Desactivar este producto?")) {
      try {
        await desactivarProducto(id);
        alert("✅ Producto desactivado correctamente");
        await cargarProductos();
      } catch (err) {
        console.error("Error al desactivar:", err);
        alert("❌ Ocurrió un error al desactivar el producto");
      }
    }
  };

  // 🔹 Activar modo edición
  const handleEditar = (p) => {
    setModoEditar(true);
    setIdEdit(p.idProducto);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      idTipo: p.idTipo,
      imagen: p.imagen,
    });
  };

  // 🔹 Cancelar edición
  const handleCancelar = () => {
    setModoEditar(false);
    setForm({ nombre: "", descripcion: "", precio: "", idTipo: "", imagen: "" });
    setIdEdit(null);
  };

  // 🔍 Filtro combinado
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = filtroTipo === "" || String(p.idTipo) === String(filtroTipo);

    const precio = parseFloat(p.precio);
    const minOk = precioMin === "" || precio >= parseFloat(precioMin);
    const maxOk = precioMax === "" || precio <= parseFloat(precioMax);

    return coincideBusqueda && coincideTipo && minOk && maxOk;
  });

  return (
    <div className="container my-4">
      <h2 className="text-2xl font-bold mb-3 text-center">
        {modoEditar ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      {/* Formulario */}
      {rol !== "CLIENTE" && (
        <>
          <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
            <label className="form-label fw-semibold">Nombre del producto *</label>
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-1"
            />
            {errores.nombre && <small className="text-danger">{errores.nombre}</small>}

            <label className="form-label fw-semibold">Descripción del producto</label>
            <input
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />

            <label className="form-label fw-semibold">Precio del producto *</label>
            <input
              name="precio"
              placeholder="Precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-1"
            />
            {errores.precio && <small className="text-danger">{errores.precio}</small>}

            <label className="form-label fw-semibold">Tipo del producto *</label>
            <select
              name="idTipo"
              value={form.idTipo}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-1"
            >
              <option value="">Selecciona un tipo *</option>
              {tipos.map((t) => (
                <option key={t.idTipo} value={t.idTipo}>
                  {t.tipo}
                </option>
              ))}
            </select>
            {errores.idTipo && <small className="text-danger">{errores.idTipo}</small>}

            <label className="form-label fw-semibold">Imagen del producto</label>
            <input
              name="imagen"
              placeholder="URL de la imagen"
              value={form.imagen}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-1"
            />
            {errores.imagen && <small className="text-danger">{errores.imagen}</small>}

            {(rol !== "CLIENTE") && (
              <>
                <button type="submit" >
                  {modoEditar ? "Actualizar Producto" : "Guardar Producto"}
                </button>

                {modoEditar && (
                  <button type="submit" onClick={handleCancelar} >
                    Cancelar
                  </button>
                )}
              </>
            )}
          </form>

        </>
      )}

      {/* 🔍 Barra de filtros */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="fw-semibold mb-2">Filtro de productos jeje</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t.idTipo} value={t.idTipo}>
                {t.tipo}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio mínimo"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio máximo"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Tabla */}
      <table className="table table-kawaii w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Tipo</th>
            <th>Imagen</th>
            {rol !== "CLIENTE" && (
              <>
                <th>Acciones</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No se encontraron productos
              </td>
            </tr>
          ) : (
            productosFiltrados.map((p) => (
              <tr key={p.idProducto}>
                <td>{p.idProducto}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${p.precio}</td>
                <td>{p.idTipo}</td>
                <td className="text-center">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                  />
                </td>
                <td>
                  {(rol === "ADMIN" || rol === "SUPERVISOR") && (
                    <button onClick={() => handleEditar(p)} className="btn-edit me-1">
                      Editar
                    </button>
                  )}
                  {rol === "ADMIN" && (
                    <button onClick={() => handleDelete(p.idProducto)} className="btn-delete">
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
