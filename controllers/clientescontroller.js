const { connectDB, sql } = require('../config/database');

exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('email', sql.NVarChar, email)
      .input('telefono', sql.NVarChar, telefono)
      .query(`
        INSERT INTO Clientes (nombre, apellido, email, telefono)
        VALUES (@nombre, @apellido, @email, @telefono);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerClientes = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Clientes');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Clientes WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono } = req.body;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('email', sql.NVarChar, email)
      .input('telefono', sql.NVarChar, telefono)
      .query(`
        UPDATE Clientes 
        SET nombre = @nombre, 
            apellido = @apellido, 
            email = @email, 
            telefono = @telefono
        WHERE id = @id;
        SELECT @@ROWCOUNT AS updatedRows;
      `);
    
    if (result.recordset[0].updatedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    res.json({ message: 'Cliente actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Clientes WHERE id = @id; SELECT @@ROWCOUNT AS deletedRows;');
    
    if (result.recordset[0].deletedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};