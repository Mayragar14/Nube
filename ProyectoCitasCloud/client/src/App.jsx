import { useState, useEffect } from 'react';

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
    if (data.token) {
      setToken(data.token);
      cargarCitas(data.token);
    } else {
      alert("Credenciales inválidas");
    }
  };

  const crearCita = async () => {
    await fetch(`${API}/citas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ fecha, servicio })
    });
    cargarCitas();
  };

  const cargarCitas = async (forceToken) => {
    const res = await fetch(`${API}/citas`, {
      headers: {
        Authorization: `Bearer ${forceToken || token}`
      }
    });
    const data = await res.json();
    setCitas(data);
  };

  return (
    <div className="container">
      <div className="app-container shadow-lg">
        <h1>Gestión de Citas</h1>

        {!token && (
          <>
            <h2>Iniciar sesión</h2>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                className="form-control"
                placeholder="Ingrese usuario"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ingrese contraseña"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={login}>
              Iniciar sesión
            </button>
          </>
        )}

        {token && (
          <>
            <hr />
            <h2>Nueva Cita</h2>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Servicio</label>
              <input
                className="form-control"
                placeholder="Ej. Odontología"
                onChange={(e) => setServicio(e.target.value)}
              />
            </div>
            <button className="btn btn-success w-100 mb-3" onClick={crearCita}>
              Guardar cita
            </button>

            <h3>Mis Citas</h3>
            <ul className="list-group">
              {citas.map((cita, i) => (
                <li key={i} className="list-group-item">
                  <strong>{cita.fecha}</strong> – {cita.servicio}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
