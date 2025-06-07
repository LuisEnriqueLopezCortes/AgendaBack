const pool = require('../db');

exports.agregarNota = async (req, res) => {
  try {
    const { id_usuario, titulo, descripcion, fecha_evento, estado } = req.body;
    const imagen = req.file ? `uploads/${req.file.filename}` : null;

    const query = `
      INSERT INTO notas (id_usuario, titulo, descripcion, fecha_evento, estado, imagen)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [id_usuario, titulo, descripcion, fecha_evento, estado, imagen];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar nota:', error);
    res.status(500).json({ message: 'Error al guardar la nota' });
  }
};

exports.obtenerNotasPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM notas WHERE id_usuario = $1 ORDER BY fecha_evento DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notas:', error);
    res.status(500).json({ message: 'Error al obtener notas' });
  }
};

exports.eliminarNota = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notas WHERE id = $1', [id]);
    res.sendStatus(204); // No Content
  } catch (error) {
    console.error('Error al eliminar nota:', error);
    res.status(500).json({ message: 'Error al eliminar nota' });
  }
};