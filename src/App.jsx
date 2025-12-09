import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ListClienteComponent } from './components/ListClienteComponent'
import ProductosList from "./components/ProductosList";
import TipoProductoComponent from "./components/TipoProductoComponent";
import { MesaComponent } from "./components/MesaComponent";
import { VentaComponent } from "./components/VentaComponent";
import { EmpleadoComponent } from "./components/EmpleadoComponent";
import { ReservaComponent } from "./components/ReservaComponent";
import LoginComponent from "./components/LoginComponent";

// === IMPORTS NUEVOS PARA ROLES ===
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* ---------------- PUBLIC ---------------- */}
          <Route path="/login" element={<LoginComponent />} />
          <Route
  path="/"
  element={
    <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "CAJERO", "MESERO", "CLIENTE"]}>
      <ListClienteComponent />
    </ProtectedRoute>
  }
/>


          {/* ---------------- PRODUCTOS ---------------- */}
          <Route
            path="/listaProducto"
            element={
              <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "CLIENTE"]}>
                <ProductosList />
              </ProtectedRoute>
            }
          />

          {/* ---------------- TIPOS DE PRODUCTO ---------------- */}
          <Route
            path="/listaTipo"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <TipoProductoComponent />
              </ProtectedRoute>
            }
          />

          {/* ---------------- MESAS ---------------- */}
          <Route
            path="/mesas"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <MesaComponent />
              </ProtectedRoute>
            }
          />

          {/* ---------------- EMPLEADOS ---------------- */}
          <Route
            path="/empleados"
            element={
              <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                <EmpleadoComponent />
              </ProtectedRoute>
            }
          />

          {/* ---------------- RESERVAS ---------------- */}
          <Route
            path="/reservas"
            element={
              <ProtectedRoute roles={["ADMIN", "CAJERO", "CLIENTE"]}>
                <ReservaComponent />
              </ProtectedRoute>
            }
          />

          {/* ---------------- VENTAS ---------------- */}
          <Route
            path="/ventas"
            element={
              <ProtectedRoute roles={["ADMIN", "CAJERO", "MESERO"]}>
                <VentaComponent />
              </ProtectedRoute>
            }
          />

        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
