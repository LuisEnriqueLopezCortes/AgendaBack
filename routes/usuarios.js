const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { actualizarUsuario } = require('../controllers/usuarioController');

router.put('/:id', upload.single('imagen'), actualizarUsuario);

module.exports = router;