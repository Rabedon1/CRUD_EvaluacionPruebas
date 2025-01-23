const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventascontroller');

router.post('/', ventasController.crearVenta);
router.get('/', ventasController.obtenerVentas);
router.get('/:id', ventasController.obtenerVentaPorId);
router.put('/:id', ventasController.actualizarVenta);
router.delete('/:id', ventasController.eliminarVenta);

module.exports = router;