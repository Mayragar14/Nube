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
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegister ? `${API}/api/auth/register` : `${API}/api/auth/login`;
    try {
      const res = await axios.post(url, { username, password });
      if (res.data.token) {
        setToken(res.data.token);
        setUsername('');
        setPassword('');
        alert(isRegister ? 'Usuario registrado con éxito' : 'Login exitoso');
        loadCitas(res.data.token);
      } else {
        alert('No se recibió un token válido.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al autenticar');
    }
  };

  const handleCita = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/citas`,
        { fecha, servicio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFecha('');
      setServicio('');
      loadCitas(token);
    } catch (err) {
      alert('Error al crear la cita');
    }
  };

  const loadCitas = async (authToken) => {
    try {
      const res = await axios.get(`${API}/citas`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCitas(res.data);
    } catch (err) {
      alert('Error al cargar las citas');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Gestión de Citas</h1>

      <form onSubmit={handleAuth}>
        <input
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
        <button type="submit">{isRegister ? 'Registrarse' : 'Iniciar sesión'}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta'}
        </button>
      </form>

      {token && (
        <>
          <h2>Crear nueva cita</h2>
          <form onSubmit={handleCita}>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
            <input
              placeholder="Servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            />
            <button type="submit">Guardar cita</button>
          </form>

          <h2>Mis citas</h2>
          <ul>
            {citas.map((cita, i) => (
              <li key={i}>
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
