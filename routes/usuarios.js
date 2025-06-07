const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const db = require('../db'); // Asegúrate de tener la conexión a MySQL aquí

const { actualizarUsuario } = require('../controllers/usuariosController');

// Ruta para actualizar usuario (ya existente)
router.put('/:id', upload.single('imagen'), actualizarUsuario);

// NUEVA ruta para obtener usuario por ID
router.get('/id/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const sql = 'SELECT * FROM usuarios WHERE id = $1';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener usuario por ID:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      res.json({ success: true, usuario: results[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  });
});

module.exports = router;