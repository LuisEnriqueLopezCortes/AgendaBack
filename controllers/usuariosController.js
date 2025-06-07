const pool = require('../db');
const fs = require('fs');
const path = require('path');

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, alias, telefono } = req.body;
  const imagen = req.file ? req.file.path : null;

  try {
    const result = await pool.query('SELECT imagen FROM usuarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuarioActual = result.rows[0];

    if (imagen && usuarioActual.imagen && fs.existsSync(usuarioActual.imagen)) {
      fs.unlinkSync(usuarioActual.imagen);
    }

    const query = `
      UPDATE usuarios
      SET nombre = $1,
          apellido = $2,
          alias = $3,
          telefono = $4,
          imagen = COALESCE($5, imagen)
      WHERE id = $6
    `;

    await pool.query(query, [nombre, apellido, alias, telefono, imagen, id]);

    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

module.exports = { actualizarUsuario };