const { connectDB, sql } = require('../config/database');

exports.crearVenta = async (req, res) => {
  try {
    const { producto_id, cantidad, total } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('producto_id', sql.Int, producto_id)
      .input('cantidad', sql.Int, cantidad)
      .input('total', sql.Decimal(10,2), total)
      .query(`
        INSERT INTO Ventas (producto_id, cantidad, total, fecha_venta)
        VALUES (@producto_id, @cantidad, @total, GETDATE());
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerVentas = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Ventas');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Ventas WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto_id, cantidad, total } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('producto_id', sql.Int, producto_id)
      .input('cantidad', sql.Int, cantidad)
      .input('total', sql.Decimal(10,2), total)
      .query(`
        UPDATE Ventas 
        SET producto_id = @producto_id, 
            cantidad = @cantidad, 
            total = @total
        WHERE id = @id;
        SELECT @@ROWCOUNT AS updatedRows;
      `);
    
    if (result.recordset[0].updatedRows === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    res.json({ message: 'Venta actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Ventas WHERE id = @id; SELECT @@ROWCOUNT AS deletedRows;');
    
    if (result.recordset[0].deletedRows === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    res.json({ message: 'Venta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};