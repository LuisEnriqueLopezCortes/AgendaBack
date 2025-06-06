const pool = require('../db');
const bcrypt = require('bcrypt');

const registrarUsuario = async (req, res) => {
  const { gmail, nombre_usuario, apellido, alias, contrasena, telefono } = req.body;

  if (!gmail || !nombre_usuario || !apellido || !alias || !contrasena || !telefono) {
    return res.json({ success: false, message: "Faltan datos obligatorios." });
  }

  try {
    const existingUser = await pool.query('SELECT id FROM usuarios WHERE gmail = $1', [gmail]);
    if (existingUser.rows.length > 0) {
      return res.json({ success: false, message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const imagenPath = req.file ? req.file.path : null;

    await pool.query(
      `INSERT INTO usuarios (gmail, nombre_usuario, apellido, alias, contrasena, telefono, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [gmail, nombre_usuario, apellido, alias, hashedPassword, telefono, imagenPath]
    );

    res.json({ success: true, message: "Usuario registrado correctamente." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al registrar usuario." });
  }
};

module.exports = { registrarUsuario };