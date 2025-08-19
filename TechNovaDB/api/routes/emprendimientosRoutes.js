const express = require('express');
const router = express.Router();
const {
  crearEmprendimiento,
  obtenerEmprendimientos,
  obtenerEmprendimientoPorId,
  actualizarEmprendimiento,
  actualizarEstadoEmprendimiento,
  eliminarEmprendimiento,
} = require('../controllers/emprendimientoController');

// Crear un nuevo emprendimiento
router.post('/', crearEmprendimiento);

// Obtener todos los emprendimientos
router.get('/', obtenerEmprendimientos);

// Obtener un emprendimiento por ID
router.get('/:id', obtenerEmprendimientoPorId);

// Actualizar un emprendimiento
router.put('/:id', actualizarEmprendimiento);

// Actualizar estado de un emprendimiento
router.patch('/:id', actualizarEstadoEmprendimiento);

// Eliminar un emprendimiento
router.delete('/:id', eliminarEmprendimiento);

module.exports = router;
