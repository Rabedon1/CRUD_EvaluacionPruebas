const { connectDB, sql } = require('../config/database');

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, cantidad_stock, categoria_id } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio', sql.Decimal(10,2), precio)
      .input('cantidad_stock', sql.Int, cantidad_stock)
      .input('categoria_id', sql.Int, categoria_id)
      .query(`
        INSERT INTO Productos 
        (nombre, descripcion, precio, cantidad_stock, categoria_id)
        VALUES (@nombre, @descripcion, @precio, @cantidad_stock, @categoria_id);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Productos');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Productos WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_stock, categoria_id } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio', sql.Decimal(10,2), precio)
      .input('cantidad_stock', sql.Int, cantidad_stock)
      .input('categoria_id', sql.Int, categoria_id)
      .query(`
        UPDATE Productos 
        SET nombre = @nombre, 
            descripcion = @descripcion, 
            precio = @precio, 
            cantidad_stock = @cantidad_stock, 
            categoria_id = @categoria_id
        WHERE id = @id;
        SELECT @@ROWCOUNT AS updatedRows;
      `);
    
    if (result.recordset[0].updatedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Productos WHERE id = @id; SELECT @@ROWCOUNT AS deletedRows;');
    
    if (result.recordset[0].deletedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};