import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://backend-citas-59bo.onrender.com';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fecha, setFecha] = useState('');
  const [servicio, setServicio] = useState('');
  const [citas, setCitas] = useState([]);

  const [isRegister, setIsRegister] = useState(false); // Alterna entre login y registro

  // Autenticación (login o registro)
  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegister ? `${API}/api/auth/register` : `${API}/api/auth/login`;

    try {
      const res = await axios.post(url, { username, password });

      if (res.data.token) {
        setToken(res.data.token);
        setUsername('');
        setPassword('');
      } else {
        alert('No se recibió un token válido.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al autenticar');
    }
  };

  // Crear nueva cita
  const handleCita = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/citas`,
        { fecha, servicio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFecha('');
      setServicio('');
      fetchCitas(); // Recargar citas
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear cita');
    }
  };

  // Obtener citas
  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API}/citas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCitas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCitas();
    }
  }, [token]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', color: '#007BFF' }}>🗓️ Gestión de Citas Médicas</h1>

      {!token && (
        <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px' }}>{isRegister ? '🔐 Registro de usuario' : '🔓 Iniciar sesión'}</h2>
            <form onSubmit={handleAuth}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
              />
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none' }}>
                {isRegister ? 'Registrarse' : 'Iniciar sesión'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'blue',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isRegister ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </section>
      )}

      {token && (
        <>
          <section style={{ border: '1px solid #28a745', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ color: '#28a745' }}>📅 Crear nueva cita</h2>
            <form onSubmit={handleCita}>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
              />
              <input
                type="text"
                placeholder="Motivo o servicio"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
              />
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>
                Guardar cita
              </button>
            </form>
          </section>

          <section style={{ border: '1px solid #17a2b8', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ color: '#17a2b8' }}>📋 Tus citas</h2>
            {citas.length === 0 ? (
              <p>No hay citas registradas.</p>
            ) : (
              <ul>
                {citas.map((cita, i) => (
                  <li key={i}>
                    <strong>{new Date(cita.fecha).toLocaleDateString()}</strong> – {cita.servicio}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            onClick={() => setToken('')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            🔒 Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}

export default App;
