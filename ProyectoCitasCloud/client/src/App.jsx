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

  // Maneja login o registro
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

  // Al iniciar sesión o registrarse exitosamente
  useEffect(() => {
    if (token) {
      fetchCitas();
    }
  }, [token]);

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>🗓️ Gestión de Citas</h1>

      {!token && (
        <form onSubmit={handleAuth} style={{ marginBottom: '20px' }}>
          <h2>{isRegister ? 'Registro' : 'Iniciar sesión'}</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            {isRegister ? 'Registrarse' : 'Iniciar sesión'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{
                border: 'none',
                background: 'none',
                color: 'blue',
                cursor: 'pointer'
              }}
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </form>
      )}

      {token && (
        <>
          <form onSubmit={handleCita}>
            <h2>Crear nueva cita</h2>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Motivo o servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '10px' }}>
              Guardar cita
            </button>
          </form>

          <button
            onClick={() => setToken('')}
            style={{ marginTop: '10px', padding: '5px 10px' }}
          >
            Cerrar sesión
          </button>

          <h2 style={{ marginTop: '30px' }}>📋 Tus citas</h2>
          <ul>
            {citas.map((cita, i) => (
              <li key={i}>
                {new Date(cita.fecha).toLocaleDateString()} – {cita.servicio}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
