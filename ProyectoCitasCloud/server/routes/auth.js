const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Utilidad para crear el token
function generarToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en variables de entorno');
  }
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

// Registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Intento de registro:', username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    const token = generarToken({ username });
    console.log('Usuario registrado:', username);
    res.status(201).json({ token });

  } catch (err) {
    console.error('❌ Error en registro:', err.message);
    res.status(500).json({ message: 'Error en el registro', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Intento de login:', username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generarToken({ username });
    console.log('Inicio de sesión exitoso:', username);
    res.json({ token });

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ message: 'Error en el login', error: err.message });
  }
});

module.exports = router;
