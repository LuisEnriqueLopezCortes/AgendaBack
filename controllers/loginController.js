const pool = require('../db');
const bcrypt = require('bcrypt');

const loginUsuario = async (req, res) => {
  const { gmail, contrasena } = req.body;

  if (!gmail || !contrasena) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE gmail = $1', [gmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    const usuario = result.rows[0];

    if (!usuario.contrasena) {
      return res.status(500).json({ success: false, message: 'Error interno: contraseña no encontrada.' });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
    }

    // Solo devolvemos lo necesario
    const datosUsuario = {
      id: usuario.id,
      gmail: usuario.gmail,
      alias: usuario.alias
    };

    res.json({ success: true, message: 'Login exitoso', usuario: datosUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
};

module.exports = { loginUsuario };