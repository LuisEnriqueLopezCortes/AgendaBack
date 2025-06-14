const express = require('express');
const router = express.Router();
const notaController = require('../controllers/notasController');
const upload = require('../middleware/upload');

router.post('/agregarNota', upload.single('imagen'), notaController.agregarNota);
router.get('/usuario/:id', notaController.obtenerNotasPorUsuario);
router.delete('/:id', notaController.eliminarNota);
router.put('/api/notas/:id', upload.single('imagen'), notaController.editarNota);

module.exports = router;