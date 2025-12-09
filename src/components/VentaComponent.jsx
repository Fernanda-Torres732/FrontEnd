import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../auth/AuthContext";
import {
  listarClientes,
  listarProductos,
  listarVentas,
  crearVenta,
} from "../services/api";
import {
  listarReservas
} from '../Service/ReservasService'
export const VentaComponent = () => {
  // 📍 Obtener parámetros de la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idReserva = queryParams.get("idReserva");
  const idCliente = queryParams.get("idCliente");
  const nombreCliente = queryParams.get("nombreCliente");

  const [clientes, setClientes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState("");
  const [carrito, setCarrito] = useState([]);
  const { user } = useAuth();
  // 🧠 Cargar datos iniciales
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [dataClientes, dataProductos, dataReservas, dataVentas] =
          await Promise.all([
            listarClientes().catch(() => []),
            listarProductos().catch(() => []),
            listarReservas().catch(() => []),
            listarVentas().catch(() => []),
          ]);

        // 🕓 Fecha actual (YYYY-MM-DD)
        const hoy = new Date().toISOString().split("T")[0];

        //  Filtrar reservas
        const reservasDeHoy = dataReservas.filter((r) => {
          const fecha = r.fechaReserva || r.fecha;
          if (!fecha) return false;
          const fechaReserva = new Date(fecha).toISOString().split("T")[0];
          return fechaReserva === hoy;
        });

        // 🔗 Agregar nombres de cliente y producto a las ventas
        const ventasConDetalles = dataVentas.map((venta) => {
          const cliente = dataClientes.find(
            (c) => c.idCliente === venta.idCliente || c.id === venta.idCliente
          );

          const detallesConNombre = (venta.detalles || []).map((d) => {
            const prod = dataProductos.find(
              (p) => p.idProducto === d.idProducto || p.id === d.idProducto
            );
            return {
              ...d,
              nombreProducto: prod?.nombreProducto || prod?.nombre || "Desconocido",
            };
          });

          return {
            ...venta,
            nombreCliente: cliente?.nombreCliente || cliente?.nombre || "Desconocido",
            empleado: venta.empleado,
            detalles: detallesConNombre,
          };
        });

        // 🧩 Guardar en estado
        setClientes(dataClientes);
        setProductos(dataProductos);
        setReservas(reservasDeHoy);
        setVentas(ventasConDetalles);

        // 🪄 Preseleccionar datos si vienen por URL
        if (idCliente) setClienteSeleccionado(idCliente);
        if (idReserva) setReservaSeleccionada(idReserva);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarTodo();
  }, [idCliente, idReserva]);

  // 🛒 Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad) => {
    if (!cantidad || cantidad <= 0) return;

    const existente = carrito.find(
      (p) => p.idProducto === producto.idProducto
    );

    if (existente) {
      setCarrito(
        carrito.map((p) =>
          p.idProducto === producto.idProducto
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad,
          precioUnitario: producto.precio || producto.precioUnitario || 0,
        },
      ]);
    }
  };

  // ❌ Eliminar producto del carrito
  const eliminarDelCarrito = (idProducto) => {
    setCarrito(carrito.filter((item) => item.idProducto !== idProducto));
  };

  // 💾 Guardar venta
  const registrarVenta = async () => {
    if (!clienteSeleccionado || carrito.length === 0) {
      alert("Selecciona un cliente y agrega al menos un producto. :,u");
      return;
    }
    const nuevaVenta = {
      idCliente: parseInt(clienteSeleccionado),
      idReserva: reservaSeleccionada ? parseInt(reservaSeleccionada) : null,
      fechaventa: new Date().toISOString().split("T")[0],
      total: carrito.reduce(
        (sum, item) => sum + item.cantidad * item.precioUnitario,
        0
      ),

      empleado: user.nombre,   

      detalles: carrito.map((p) => ({
        idProducto: p.idProducto,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
      })),
    };


    try {
      await crearVenta(nuevaVenta);
      alert("✅ Venta registrada exitosamente.");
      setCarrito([]);
      window.location.reload();
    } catch (error) {
      console.error("Error creando venta:", error);
      alert("❌ Error al registrar la venta.");
    }
  };
  const generarPdfVenta = (venta) => {
    const doc = new jsPDF();

    // 🧾 Título
    doc.setFontSize(18);
    doc.text(`Ticket de Venta #${venta.idVenta}`, 14, 20);

    // 👤 Datos del cliente
    doc.setFontSize(12);
    doc.text(`Cliente: ${venta.nombreCliente}`, 14, 30);
    doc.text(`Fecha: ${venta.fechaventa || venta.fechaVenta}`, 14, 38);
    doc.text(`Empleado: ${venta.empleado || "No especificado"}`, 14, 54);
    if (venta.idReserva) {
      doc.text(`Reserva: #${venta.idReserva}`, 14, 46);
    }

    // 📦 Tabla de productos
    const rows = venta.detalles.map((d) => [
      d.nombreProducto,
      d.cantidad,
      `$${d.precioUnitario}`,
      `$${d.cantidad * d.precioUnitario}`,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Producto", "Cantidad", "Precio U.", "Subtotal"]],
      body: rows,
    });

    // 💲 Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total: $${venta.total}`, 14, finalY);

    // 💾 Descargar PDF
    doc.save(`venta_${venta.idVenta}.pdf`);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Gestión de Ventas</h2>

      {/* 🎯 Formulario para seleccionar cliente y reserva */}
      <form className="card p-4 mb-4 shadow-sm">
        {/* 🧍 Cliente */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Cliente*</label>
          <select
            className="form-select"
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCliente}
              </option>
            ))}
          </select>
        </div>

        {/* 📅 Reserva */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Reserva (opcional)</label>
          <select
            className="form-select"
            value={reservaSeleccionada}
            onChange={(e) => setReservaSeleccionada(e.target.value)}
          >
            <option value="">Sin reserva</option>
            {reservas.map((r) => (
              <option key={r.idReserva} value={r.idReserva}>
                {`#${r.idReserva} - ${r.nombreCliente}`}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <button
            onClick={() =>
              console.log("Cliente:", clienteSeleccionado, "Reserva:", reservaSeleccionada)
            }
          >
            Continuar
          </button>
        </div>
      </form>
      {/* 🛍️ Sección de productos - RESPONSIVE GRID ESTRICTO */}
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 8px' }}>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Productos disponibles
        </h3>

        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            width: '100%'
          }}
        >
          {productos.map((p) => (
            <div
              key={p.idProducto}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-lg p-2 w-full"
              style={{ minWidth: '0' }}
            >
              {/* 🖼️ Imagen */}
              <div className="mb-2">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  className="w-14 h-14 object-cover rounded"
                />
              </div>

              {/* 📝 Información del producto */}
              <div className="text-center w-full mb-2">
                <h4 className="font-medium text-gray-800 text-xs mb-1 line-clamp-2 leading-tight">
                  {p.nombre}
                </h4>
                <p className="text-green-600 font-bold text-xs">
                  ${p.precio}
                </p>
              </div>

              {/* ➕ Agregar al carrito */}
              <div className="w-full">
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-10 p-1 border border-gray-300 rounded text-center text-xs mb-1 mx-auto block"
                  id={`cantidad-${p.idProducto}`}
                />
                <button
                  className="w-full bg-blue-500 text-white py-1 rounded text-xs hover:bg-blue-600 transition-colors duration-200 font-medium"
                  onClick={() =>
                    agregarAlCarrito(
                      p,
                      parseInt(
                        document.getElementById(`cantidad-${p.idProducto}`).value || 1
                      )
                    )
                  }
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🕳️ Mensaje si no hay productos */}
      {productos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay productos disponibles</p>
        </div>
      )}

      {/* 🧾 Carrito */}
      <h3>Carrito</h3>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <table className="table table-kawaii">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.idProducto || item.id}>
                  <td>{item.nombreProducto || item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precioUnitario}</td>
                  <td>${item.precioUnitario * item.cantidad}</td>
                  <td>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      onClick={() =>
                        eliminarDelCarrito(item.idProducto || item.id)
                      }
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>
            Total: $
            {carrito.reduce(
              (sum, item) => sum + item.precioUnitario * item.cantidad,
              0
            )}
          </h4>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={registrarVenta}
          >
            Registrar Venta
          </button>
        </>
      )}

      {/* 📅 Filtro por fecha exacta */}
      <div className="card p-3 mb-4 shadow-sm">
        <label className="fw-semibold">Filtrar ventas por fecha:</label>
        <input
          type="date"
          className="form-control border border-gray-300 rounded p-2"
          onChange={(e) => {
            const fechaSeleccionada = e.target.value;
            if (!fechaSeleccionada) {
              setVentas(ventas);
              return;
            }
            const filtradas = ventas.filter((v) => {
              const fechaVenta = new Date(v.fechaventa || v.fechaVenta)
                .toISOString()
                .split("T")[0];
              return fechaVenta === fechaSeleccionada;
            });
            setVentas(filtradas);
          }}
        />
      </div>

      {/* 📜 Historial de Ventas */}
      <h3>Historial de Ventas</h3>
      {ventas.length === 0 ? (
        <p>No hay ventas registradas</p>
      ) : (
        <table className="table table-kawaii">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Reserva</th>
              <th>Empleado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.idVenta || v.id}>
                <td>{v.idVenta || v.id}</td>
                <td>{v.nombreCliente}</td>
                <td>
                  {v.detalles && v.detalles.length > 0 ? (
                    <ul>
                      {v.detalles.map((d, idx) => (
                        <li key={idx}>
                          {d.nombreProducto} × {d.cantidad} (${d.precioUnitario})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Sin detalles"
                  )}
                </td>
                <td>${v.total}</td>
                <td>{v.idReserva ? `#${v.idReserva}` : "Ninguna"}</td>
                <td>{v.empleado ?? "—"}</td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => generarPdfVenta(v)}
                  >
                    Descargar PDF
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

};
