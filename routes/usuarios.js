const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const db = require('../db'); // Asegúrate de tener la conexión a MySQL aquí

const { actualizarUsuario } = require('../controllers/usuariosController');
const { actualizarPassword } = require('../controllers/usuariosController');

// Ruta para actualizar usuario (ya existente)
router.put('/:id', upload.single('imagen'), actualizarUsuario);

router.put('/actualizarPassword', actualizarPassword);

// NUEVA ruta para obtener usuario por ID
router.get('/id/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('Buscando ID:', id);

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    console.log('🔍 Resultado SQL:', result.rows);

    if (result.rows.length > 0) {
      res.json({ success: true, usuario: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener usuario por ID:', err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;