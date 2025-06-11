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
