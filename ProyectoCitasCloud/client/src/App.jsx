import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Opcional: crea un archivo App.css si prefieres estilos separados

const API = 'https://backend-citas-59bo.onrender.com';

function App() {
  const [token, setToken] = useState('');
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

  const handleCrearCita = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/citas`, { fecha, servicio }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFecha('');
      setServicio('');
      fetchCitas();
    } catch (err) {
      alert('Error al crear cita');
    }
  };

  const handleLogout = () => {
    setToken('');
    setCitas([]);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: 600, margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Gestión de Citas</h1>

      {!token ? (
        <form onSubmit={handleAuth} style={{ marginBottom: '2rem' }}>
          <h2>{isRegister ? 'Registro' : 'Iniciar Sesión'}</h2>
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
          <button type="submit" style={buttonStyle}>
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
         <p>
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="link-button"
            >
            {isRegister ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          </p>
        </form>
      ) : (
        <>
          <button onClick={handleLogout} style={logoutButtonStyle}>Cerrar Sesión</button>
          <form onSubmit={handleCrearCita} style={{ marginTop: '2rem' }}>
            <h2>Crear Cita</h2>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Crear</button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h2>Mis Citas</h2>
            <ul>
              {citas.map((cita) => (
                <li key={cita._id}>{cita.fecha} - {cita.servicio}</li>
              ))}
            </ul>
          </div>
        </>
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
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#007bff',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: 0,
};


export default App;
