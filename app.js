const express = require('express');
const cors = require('cors');
require('dotenv').config();

const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');

const app = express();

app.use(cors());
app.use(express.json()); // Para JSON
app.use(express.urlencoded({ extended: true })); // Para x-www-form-urlencoded

app.use('/uploads', express.static('uploads'));
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


// routes/register.js
