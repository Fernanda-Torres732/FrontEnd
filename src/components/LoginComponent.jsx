import { useState } from "react";
import { login } from "../services/login";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginComponent() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState("CLIENTE");
  const [errores, setErrores] = useState({});
  const [modoRegistro, setModoRegistro] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // 👉 VALIDACIÓN ESTANDARIZADA
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es requerido";
    if (!password.trim()) nuevosErrores.password = "La contraseña es requerida";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // 👉 LOGIN NORMAL
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const data = await login(usuario, password, tipo);
      loginUser(data);
      navigate("/");
    } catch (err) {
      setErrores({ general: err.message });
    }
  };

  // 👉 REGISTRO DE CLIENTE
  const handleRegistro = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const nuevoCliente = {
        nombre: usuario,
        password: password,
      };

      await axios.post("https://reservas-4472428832.us-central1.run.app/auth/login", nuevoCliente);

      alert("Registro exitoso, ahora puedes iniciar sesión");

      setModoRegistro(false); // regresar al login
      setUsuario("");
      setPassword("");
      setErrores({});
    } catch (err) {
      setErrores({ general: "Error al registrar. Intenta otro nombre." });
    }
  };

  return (
    <div className="container col-4 mt-5">
      <div className="card p-4 shadow">
        <h3 className="text-center mb-3">
          {modoRegistro ? "Registrar cliente" : "Inicio de sesión"}
        </h3>

        {/* FORMULARIO */}
        <form onSubmit={modoRegistro ? handleRegistro : handleSubmit}>
          {!modoRegistro && (
            <>
              {/* SELECT TIPO DE USUARIO */}
              <div className="mb-3">
                <label className="form-label">Tipo de usuario</label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="EMPLEADO">Empleado</option>
                </select>
              </div>
            </>
          )}

          {/* USUARIO */}
          <div className="mb-3">
            <label className="form-label">
              {modoRegistro
                ? "Nombre del cliente"
                : tipo === "CLIENTE"
                ? "Nombre del cliente"
                : "Nombre del empleado"}
            </label>

            <input
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder={
                modoRegistro
                  ? "Nombre del cliente"
                  : tipo === "CLIENTE"
                  ? "Nombre del cliente"
                  : "Nombre del empleado"
              }
            />
            {errores.usuario && (
              <small className="text-danger">{errores.usuario}</small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errores.password && (
              <small className="text-danger">{errores.password}</small>
            )}
          </div>

          {/* ERROR GENERAL */}
          {errores.general && (
            <div className="text-danger mt-2">{errores.general}</div>
          )}

          {/* BOTÓN PRINCIPAL */}
          <button 
          >
            {modoRegistro ? "Registrarse" : "Ingresar"}
          </button>
        </form>

        {/* CAMBIO ENTRE LOGIN / REGISTRO */}
        <div className="text-center mt-3">
          {!modoRegistro ? (
            <button
              className="btn btn-link"
              onClick={() => setModoRegistro(true)}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          ) : (
            <button
              className="btn btn-link"
              onClick={() => setModoRegistro(false)}
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
