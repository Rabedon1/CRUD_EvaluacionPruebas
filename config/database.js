const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log('Conexión a base de datos establecida');
    return pool;
  } catch (err) {
    console.error('Error de conexión:', err);
    throw err;
  }
}

module.exports = { connectDB, sql };