const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const citaRoutes = require('./routes/cita');
require('dotenv').config();

const app = express();

app.use(cors());


app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/citas', citaRoutes);

app.get('/', (req, res) => res.send('API funcionando'));
app.get('/api', (req, res) => res.send('API base activa'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
