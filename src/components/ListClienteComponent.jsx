import { useEffect, useState } from 'react'
import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  desactivarCliente,
} from '../services/api'
import { useAuth } from "../auth/AuthContext";
export function ListClienteComponent() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { user } = useAuth();
  const rol = user?.rol;
  const [form, setForm] = useState({
    id: null,
    nombreCliente: '',
    correoCliente: '',
    telefonoCliente: '',
    password: ''
  })

  const [modoEditar, setModoEditar] = useState(false)
  const [errores, setErrores] = useState({})
  const [searchTerm, setSearchTerm] = useState('') 

  // Cargar lista de clientes
  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = async () => {
    try {
      const data = await listarClientes()
      setClientes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}
    if (!form.nombreCliente.trim()) nuevosErrores.nombreCliente = 'El nombre es requerido'
    if (!form.telefonoCliente.trim()) nuevosErrores.telefonoCliente = 'El teléfono es requerido'
    if (!form.correoCliente.trim()) nuevosErrores.correoCliente = 'El correo es requerido'
    if (!modoEditar && !form.password.trim()) nuevosErrores.password = 'La contraseña es requerida'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validarFormulario()) return
  setSaving(true)

  try {
    let dataToSend = { ...form }

    // Si está editando y el password está vacío -> no enviar el campo
    if (modoEditar && !form.password.trim()) {
      delete dataToSend.password
    }

    if (modoEditar) {
      await actualizarCliente(form.id, dataToSend)
      alert('✅ Cliente actualizado correctamente')
    } else {
      await crearCliente(dataToSend)
      alert('✅ Cliente agregado correctamente')
    }

    setForm({
      id: null,
      nombreCliente: '',
      correoCliente: '',
      telefonoCliente: '',
      password: ''
    })

    setModoEditar(false)
    cargarClientes()

  } catch (err) {
    alert('❌ ' + err.message)
  } finally {
    setSaving(false)
  }
}


  const handleEditar = (cliente) => {
    setForm(cliente)
    setModoEditar(true)
  }

  const handleCancelar = () => {
    setForm({ id: null, nombreCliente: '', correoCliente: '', telefonoCliente: '' })
    setModoEditar(false)
    setErrores({})
  }

  const handleDelete = async (id) => {
    if (confirm("¿Desactivar este cliente?")) {
      try {
        await desactivarCliente(id)
        alert("Cliente desactivado correctamente ✅")
        cargarClientes()
      } catch (err) {
        alert("❌ Error al desactivar: " + err.message)
      }
    }
  }

  // 🔎 Filtrado dinámico
  const clientesFiltrados = clientes.filter((c) =>
    c.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="container py-4"><div className="alert alert-info">Cargando clientes...</div></div>
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">{modoEditar ? 'Editar Cliente' : 'Agregar Cliente'}</h2>

      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <div className="mb-3">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            name="nombreCliente"
            className="form-control"
            placeholder="Ej. Fernanda Torres"
            value={form.nombreCliente}
            onChange={handleChange}
          />
          {errores.nombreCliente && <small className="text-danger">{errores.nombreCliente}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono *</label>
          <input
            type="tel"
            name="telefonoCliente"
            className="form-control"
            placeholder="Ej. 5512345678"
            value={form.telefonoCliente}
            onChange={handleChange}
          />
          {errores.telefonoCliente && <small className="text-danger">{errores.telefonoCliente}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Correo *</label>
          <input
            type="email"
            name="correoCliente"
            className="form-control"
            placeholder="Ej. usuario@correo.com"
            value={form.correoCliente}
            onChange={handleChange}
          />
          {errores.correoCliente && <small className="text-danger">{errores.correoCliente}</small>}
        </div>
        <div className="mb-3">
  <label className="form-label">Contraseña { !modoEditar && '*' }</label>
  <input
    type="password"
    name="password"
    className="form-control"
    placeholder={modoEditar ? "Dejar vacío para no cambiar" : "Ej. 123456"}
    value={form.password}
    onChange={handleChange}
  />
  {errores.password && <small className="text-danger">{errores.password}</small>}
</div>

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : modoEditar ? 'Actualizar Cliente' : 'Guardar Cliente'}
        </button>

        {modoEditar && (
          <button type="button" onClick={handleCancelar}>
            Cancelar
          </button>
        )}
      </form>

      {/* 🔍 Barra de búsqueda */}
      {(rol === "ADMIN" || rol === "SUPERVISOR" || rol === "CAJERO") && (
        <>
          <div className="card p-3 mb-4 shadow-sm">
            <div className="mb-3">
              <h5 className="fw-semibold mb-2">Filtro por nombre y letra :u</h5>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar cliente por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="card soft">
            <div className="table-responsive">
              <table className="table table-hover m-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    {rol === "ADMIN" && (
                      <>
                        <th>Acciones</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No se encontraron clientes</td>
                    </tr>
                  ) : (
                    clientesFiltrados.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.nombreCliente}</td>
                        <td>{c.telefonoCliente}</td>
                        <td>{c.correoCliente}</td>
                        {rol === "ADMIN" && (
                          <>
                            <td>
                              <button onClick={() => handleEditar(c)} className="btn-edit">Editar</button>
                              <button onClick={() => handleDelete(c.id)} className="btn-delete">Eliminar</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
