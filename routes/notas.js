const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { subirNota } = require('../controllers/notasController');

// Configuración de multer para múltiples archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/notas';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ruta para guardar nota con múltiples archivos
router.post('/', upload.array('archivos'), subirNota);

module.exports = router;