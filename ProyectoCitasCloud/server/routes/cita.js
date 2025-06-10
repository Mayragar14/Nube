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

router.get('/', auth, async (req, res) => {
  const citas = await Cita.find({ user: req.user.username });
  res.json(citas);
});

router.post('/', auth, async (req, res) => {
  const { fecha, servicio } = req.body;
  const nueva = new Cita({ user: req.user.username, fecha, servicio });
  await nueva.save();
  res.json({ message: 'Cita registrada' });
});

module.exports = router;