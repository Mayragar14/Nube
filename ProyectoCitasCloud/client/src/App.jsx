import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://backend-citas-59bo.onrender.com';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicio, setServicio] = useState('');
  const [citas, setCitas] = useState([]);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCitas();
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegister ? `${API}/api/auth/register` : `${API}/api/auth/login`;
    try {
      const res = await axios.post(url, { username, password });
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUsername('');
        setPassword('');
      } else {
        alert('No se recibió un token válido.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al autenticar');
    }
  };

  const handleCrearCita = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/api/citas`,
        { fecha, servicio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFecha('');
      setServicio('');
      fetchCitas();
    } catch (err) {
      alert('Error al crear la cita');
    }
  };

  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API}/api/citas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(res.data);
    } catch (err) {
      console.error('Error al cargar citas:', err);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Citas</h1>

      {!token ? (
        <>
          <h2>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>
          <form onSubmit={handleAuth}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isRegister ? 'Registrarse' : 'Ingresar'}</button>
          </form>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Cerrar sesión</button>

          <h2>Crear Cita</h2>
          <form onSubmit={handleCrearCita}>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            />
            <button type="submit">Guardar cita</button>
          </form>

          <h2>Mis Citas</h2>
          <ul>
            {citas.map((cita) => (
              <li key={cita._id}>
                {cita.fecha} - {cita.servicio}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
