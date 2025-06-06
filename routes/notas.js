const express = require('express');
const router = express.Router();
const notaController = require('../controllers/notasController');
const upload = require('../middleware/upload');

router.post('/agregarNota', upload.single('imagen'), notaController.agregarNota);

module.exports = router;