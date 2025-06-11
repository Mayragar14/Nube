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
        cargarCitas(res.data.token);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFecha('');
      setServicio('');
      cargarCitas(token);
    } catch (err) {
      alert('Error al crear la cita');
    }
  };

  const cargarCitas = async (authToken) => {
    try {
      const res = await axios.get(`${API}/citas`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCitas(res.data);
    } catch (err) {
      alert('Error al cargar citas');
    }
  };

  return (
    <div>
      <h1>Gestión de Citas</h1>
      <form onSubmit={handleAuth}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isRegister ? 'Registrarse' : 'Iniciar sesión'}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        </button>
      </form>

      {token && (
        <>
          <h2>Crear Cita</h2>
          <form onSubmit={handleCita}>
            <input
              placeholder="Fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <input
              placeholder="Servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
            />
            <button type="submit">Guardar</button>
          </form>

          <h2>Mis Citas</h2>
          <ul>
            {citas.map((cita, i) => (
              <li key={i}>{cita.fecha} - {cita.servicio}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

