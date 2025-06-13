import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'https://backend-citas-59bo.onrender.com';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicio, setServicio] = useState('');
  const [citas, setCitas] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [citaEditandoId, setCitaEditandoId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCitas();
    }
  }, [token]);

  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API}/api/citas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(res.data);
    } catch (err) {
      alert('Error al obtener citas');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isRegister ? `${API}/api/auth/register` : `${API}/api/auth/login`;
    try {
      const res = await axios.post(url, { username, password });
      if (res.data.token) {
        setToken(res.data.token);
        setUsername('');
        setPassword('');
        showToast(isRegister ? 'Usuario registrado con éxito' : 'Inicio de sesión exitoso', 'success');
      } else {
        showToast('No se recibió un token válido.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al autenticar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarCita = async (e) => {
    e.preventDefault();

    if (!fecha || !servicio) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(fecha);

    if (fechaSeleccionada < hoy) {
      showToast('La fecha no puede ser anterior al día de hoy', 'error');
      return;
    }

    try {
      if (modoEdicion && citaEditandoId) {
        await axios.put(`${API}/api/citas/${citaEditandoId}`, { fecha, servicio }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast('Cita actualizada con éxito', 'success');
      } else {
        await axios.post(`${API}/api/citas`, { fecha, servicio }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast('Cita creada con éxito', 'success');
      }

      setFecha('');
      setServicio('');
      setModoEdicion(false);
      setCitaEditandoId(null);
      fetchCitas();

    } catch (err) {
      showToast('Error al guardar la cita', 'error');
    }
  };

  const handleEliminarCita = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

    try {
      await axios.delete(`${API}/api/citas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Cita eliminada con éxito', 'success');
      fetchCitas();
    } catch (err) {
      showToast('Error al eliminar cita', 'error');
    }
  };

  const handleEditarCita = (cita) => {
    setFecha(cita.fecha.slice(0, 10));
    setServicio(cita.servicio);
    setCitaEditandoId(cita._id);
    setModoEdicion(true);
  };

  const handleLogout = () => {
    setToken('');
    setCitas([]);
    setFecha('');
    setServicio('');
    setModoEdicion(false);
    setCitaEditandoId(null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: 600, margin: 'auto', position: 'relative' }}>
      <h1 style={{ textAlign: 'center' }}>🗓️ GESTIÓN DE CITAS MÉDICAS</h1>
      {loading && <div className="spinner"></div>}

      {!token ? (
        <>
          <form onSubmit={handleAuth} style={{ marginBottom: '2rem', marginTop: '3rem' }}>
            <h2>{isRegister ? '🔐 Registro' : '🔓 Iniciar sesión'}</h2>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={buttonStyle}>
                {isRegister ? 'Registrarse' : 'Entrar'}
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p>
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="link-button"
                >
                  {isRegister ? 'Inicia sesión' : 'Regístrate'}
                </button>
              </p>
            </div>
          </form>
        </>
      ) : (
        <>
          <button onClick={handleLogout} style={logoutButtonStyle}>Cerrar Sesión</button>

          <div style={{ position: 'relative', marginTop: '2rem' }}>
            <form onSubmit={handleGuardarCita}>
              <h2>{modoEdicion ? 'Editar Cita' : 'Crear Cita'}</h2>

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Fecha de la cita:
              </label>
              <input
                type="date"
                value={fecha}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFecha(e.target.value)}
                required
                style={inputStyle}
              />

              <label style={{ display: 'block', marginBottom: '5px', marginTop: '10px', fontWeight: 'bold' }}>
                Tipo de servicio:
              </label>
              <select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                style={{
                  borderColor: servicio === "" ? "red" : "#ccc",
                  padding: "8px",
                  marginBottom: "10px",
                  width: '100%',
                  fontSize: '16px'
                }}
              >
                <option value="">-- Selecciona un servicio --</option>
                <option value="Consulta médica">Consulta médica</option>
                <option value="Psicología">Psicología</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Asesoría técnica">Asesoría técnica</option>
                <option value="Otro">Otro</option>
              </select>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={buttonStyle}>
                  {modoEdicion ? 'Actualizar' : 'Crear'}
                </button>
                {modoEdicion && (
                  <button
                    type="button"
                    onClick={() => {
                      setModoEdicion(false);
                      setCitaEditandoId(null);
                      setFecha('');
                      setServicio('');
                    }}
                    style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h2>Mis Citas</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {citas.map((cita) => (
                <li
                  key={cita._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <span>
                    <strong>{new Date(cita.fecha).toLocaleDateString()}</strong> - {cita.servicio}
                  </span>
                  <div>
                    <button
                      onClick={() => handleEditarCita(cita)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#f0ad4e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                   🖊️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminarCita(cita._id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                    🗑️ Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#51a0f5',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  margin: '0 auto',
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

export default App;
