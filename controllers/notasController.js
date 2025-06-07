const pool = require('../db');
const path = require('path');
const fs = require('fs');


const subirNota = async (req, res) => {
  const {
    id_usuario,
    titulo,
    descripcion,
    fecha_evento,
    tipo,
    prioridad,
    recordatorio = null,
    estado
  } = req.body;

  if (!id_usuario || !titulo || !fecha_evento || !tipo) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios (id_usuario, titulo, fecha_evento, tipo).'
    });
  }

  try {
    // Insertar nota
    const insertNotaResult = await pool.query(
  `INSERT INTO notas_agenda 
    (id_usuario, titulo, descripcion, fecha_evento, estado, tipo, prioridad)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING id`,
  [id_usuario, titulo, descripcion, fecha_evento, estado, tipo, prioridad]
);

    const notaId = insertNotaResult.rows[0].id;

    // Guardar archivos asociados, si hay
    if (req.files && req.files.length > 0) {
      for (const archivo of req.files) {
        const url = archivo.path.replace(/\\/g, '/');
        const tipo = archivo.mimetype;

        await pool.query(
          `INSERT INTO archivos_nota (id_nota, url_archivo, tipo_archivo)
           VALUES ($1, $2, $3)`,
          [notaId, url, tipo]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Nota guardada correctamente.',
      nota_id: notaId
    });

  } catch (error) {
    console.error("Error al guardar nota:", error.message);
    console.log("Body:", req.body);
    console.log("Archivos:", req.files); // Este log es clave
    res.status(500).json({ success: false, message: "Error en el servidor al guardar la nota." });
  }
};

module.exports = { subirNota };