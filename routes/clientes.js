const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientescontroller');

router.post('/', clientesController.crearCliente);
router.get('/', clientesController.obtenerClientes);
router.get('/:id', clientesController.obtenerClientePorId);
router.put('/:id', clientesController.actualizarCliente);
router.delete('/:id', clientesController.eliminarCliente);

module.exports = router;