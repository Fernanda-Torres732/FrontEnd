import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logoutUser } = useAuth();


  const rol = user?.rol;
  const nombre = user?.nombre;

  return (
    <header className="header-kawaii">
      <div className="header-container">
        <div className="logo">Restaurante mio jeje :D</div>

        {/* Mostrar usuario loggeado */}
        <div className="user-label">Usuario: {nombre ?? "—"} ({rol ?? "—"})</div>

        <nav className="nav-links">

          {/* CLIENTES — lo pueden ver todos menos CLIENTE */}
          {(rol === "ADMIN" || rol === "SUPERVISOR" || rol === "CAJERO" || rol === "MESERO" || rol === "CLIENTE") && (
            <NavLink className="nav-link" to="/">Clientes</NavLink>
          )}

          {/* PRODUCTOS */}
          {(rol === "ADMIN" || rol === "SUPERVISOR" || rol === "CLIENTE") && (
            <NavLink className="nav-link" to="/listaProducto">Productos</NavLink>
          )}

          {/* TIPOS */}
          {rol === "ADMIN" && (
            <NavLink className="nav-link" to="/listaTipo">Tipos</NavLink>
          )}

          {/* RESERVAS */}
          {(rol === "ADMIN" || rol === "CAJERO" || rol === "CLIENTE") && (
            <NavLink className="nav-link" to="/reservas">Reservas</NavLink>
          )}

          {/* EMPLEADOS */}
          {(rol === "ADMIN" || rol === "SUPERVISOR") && (
            <NavLink className="nav-link" to="/empleados">Empleaditos</NavLink>
          )}

          {/* MESAS */}
          {rol === "ADMIN" && (
            <NavLink className="nav-link" to="/mesas">Mesas</NavLink>
          )}

          {/* VENTAS */}
          {(rol === "ADMIN" || rol === "CAJERO" || rol === "MESERO") && (
            <NavLink className="nav-link" to="/ventas">Ventas</NavLink>
          )}

          {/* SIEMPRE mostrar Salir si hay sesión */}
          {rol && (
            <NavLink className="nav-link" to="/login" onClick={logoutUser}>
  Salir
</NavLink>

          )}
        </nav>
      </div>
    </header>
  );
}
