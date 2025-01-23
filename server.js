const express = require('express');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const clientesRoutes = require('./routes/clientes');
const ventasRoutes = require('./routes/ventas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});