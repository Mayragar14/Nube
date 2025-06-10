import { useState } from 'react';
const API = import.meta.env.VITE_API_URL;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicio, setServicio] = useState('');
  const [citas, setCitas] = useState([]);

  const login = async () => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
  };

  const crearCita = async () => {
    await fetch(`${API}/citas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ fecha, servicio })
    });
    cargarCitas();
  };

  const cargarCitas = async () => {
    const res = await fetch(`${API}/citas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCitas(data);
  };

  return (
    <div>
      <h1>Gestión de Citas</h1>
      <input placeholder="Usuario" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Iniciar sesión</button>

      {token && (
        <>
          <h2>Crear Cita</h2>
          <input placeholder="Fecha" onChange={e => setFecha(e.target.value)} />
          <input placeholder="Servicio" onChange={e => setServicio(e.target.value)} />
          <button onClick={crearCita}>Guardar</button>

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
