const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriascontroller');

router.post('/', categoriasController.crearCategoria);
router.get('/', categoriasController.obtenerCategorias);
router.get('/:id', categoriasController.obtenerCategoriaPorId);
router.put('/:id', categoriasController.actualizarCategoria);
router.delete('/:id', categoriasController.eliminarCategoria);

module.exports = router;