const { connectDB, sql } = require('../config/database');

exports.crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .query(`
        INSERT INTO Categorias (nombre, descripcion)
        VALUES (@nombre, @descripcion);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Categorias');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Categorias WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .query(`
        UPDATE Categorias 
        SET nombre = @nombre, 
            descripcion = @descripcion
        WHERE id = @id;
        SELECT @@ROWCOUNT AS updatedRows;
      `);
    
    if (result.recordset[0].updatedRows === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json({ message: 'Categoría actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Categorias WHERE id = @id; SELECT @@ROWCOUNT AS deletedRows;');
    
    if (result.recordset[0].deletedRows === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};