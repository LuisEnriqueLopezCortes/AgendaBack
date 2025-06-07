const pool = require('../db');
const path = require('path');
const fs = require('fs');

const subirNota = async (req, res) => {
  const {
    idUsuario,
    gmail,
    titulo,
    descripcion,
    fecha_evento,
    estado,
    tipo,
    prioridad
  } = req.body;

  if (!idUsuario || !gmail || !titulo || !descripcion || !fecha_evento || !estado || !tipo || !prioridad) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
  }

  try {
    // Insertar la nota en la tabla principal
    const insertNotaResult = await pool.query(
      `INSERT INTO notas (id_usuario, gmail, titulo, descripcion, fecha_evento, estado, tipo, prioridad)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [idUsuario, correo, titulo, descripcion, fecha_evento, estado, tipo, prioridad]
    );

    const notaId = insertNotaResult.rows[0].id;

    // Insertar los archivos asociados a esta nota (si los hay)
    if (req.files && req.files.length > 0) {
      for (const archivo of req.files) {
        const ruta = archivo.path.replace(/\\/g, '/'); // Para Windows
        await pool.query(
          `INSERT INTO archivos_nota (id_nota, ruta_archivo)
           VALUES ($1, $2)`,
          [notaId, ruta]
        );
      }
    }

    res.status(201).json({ success: true, message: "Nota guardada correctamente." });

  } catch (error) {
    console.error("Error al guardar nota:", error);
    res.status(500).json({ success: false, message: "Error en el servidor al guardar la nota." });
  }
};

module.exports = { subirNota };