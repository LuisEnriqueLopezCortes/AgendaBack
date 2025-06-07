const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const notaController = require("../controllers/notaController");

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // imagen.jpg -> 162387192.jpg
  },
});
const upload = multer({ storage: storage });

// ESTA LÍNEA ES LA CLAVE:
router.post("/api/notas", upload.single("imagen"), notaController.agregarNota);

module.exports = router;