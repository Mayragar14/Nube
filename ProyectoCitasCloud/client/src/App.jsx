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
      <h1 style={{ textAlign: 'center' }}>🗓️ GESTIÓN DE CITAS MÉDICAS</h1>
      {loading && <div className="spinner"></div>}

      {!token ? (
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
      {toast.show && (
      <div className={`toast ${toast.type}`}>
      {toast.message}
      </div>
      )}
        
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
  margin: '0 auto',
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
  margin: '0 auto',
};


export default App;
