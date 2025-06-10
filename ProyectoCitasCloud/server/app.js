const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Registro con generación automática de token
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Usuario ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ token }); // Enviar token directamente después de registrarse
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar', error: err.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en login', error: err.message });
  }
});

module.exports = router;

