const pool = require('../db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, apellido, alias, telefono } = req.body;
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
      SET nombre_usuario = $1,
          apellido = $2,
          alias = $3,
          telefono = $4,
          imagen = COALESCE($5, imagen)
      WHERE id = $6
    `;

    await pool.query(query, [nombre_usuario, apellido, alias, telefono, imagen, id]);

    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// ACTUALIZAR CONTRASEÑA DEL USUARIO
const actualizarPassword = async (req, res) => {
  const { gmail, passwordActual, nuevoPassword } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE gmail = $1', [gmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(passwordActual, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
    }

    const nuevoPasswordHash = await bcrypt.hash(nuevoPassword, 10);

    await pool.query('UPDATE usuarios SET contrasena = $1 WHERE gmail = $2', [nuevoPasswordHash, gmail]);

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

module.exports = {
  actualizarUsuario,
  actualizarPassword, // <--- Importante agregar esta línea
};