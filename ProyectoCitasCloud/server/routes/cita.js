// rutas/citas.js (completo)
const express = require('express');
const jwt = require('jsonwebtoken');
const Cita = require('../models/Cita');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(403);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
};

// GET - Listar citas del usuario
router.get('/', auth, async (req, res) => {
  const citas = await Cita.find({ user: req.user.username });
  res.json(citas);
});

// POST - Crear nueva cita
router.post('/', auth, async (req, res) => {
  const { fecha, servicio } = req.body;
  const nueva = new Cita({ user: req.user.username, fecha, servicio });
  await nueva.save();
  res.json({ message: 'Cita registrada' });
});

// PUT - Actualizar cita por ID
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { fecha, servicio } = req.body;

  try {
    const cita = await Cita.findById(id);
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });

    if (cita.user !== req.user.username) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    cita.fecha = fecha;
    cita.servicio = servicio;
    await cita.save();

    res.json({ message: 'Cita actualizada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
});

// DELETE - Eliminar cita por ID
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const cita = await Cita.findById(id);
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });

    if (cita.user !== req.user.username) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await cita.deleteOne();
    res.json({ message: 'Cita eliminada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la cita' });
  }
});

module.exports = router;
