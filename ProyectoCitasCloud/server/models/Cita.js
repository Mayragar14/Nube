const mongoose = require('mongoose');
const citaSchema = new mongoose.Schema({
  user: String,
  fecha: String,
  servicio: String,
});
module.exports = mongoose.model('Cita', citaSchema);