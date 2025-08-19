const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware , anuncioController.crearAnuncio);
// api/routes/anuncioRoutes.js
router.get("/", anuncioController.listarAnuncios);
router.get('/', anuncioController.obtenerAnuncios);
router.get('/:id', anuncioController.obtenerAnuncio);
router.put('/:id', anuncioController.actualizarAnuncio);
router.delete('/:id', anuncioController.eliminarAnuncio);

// patch para actualizar solo el estado del anuncio
router.patch('/:id', anuncioController.actualizarEstadoAnuncio);

module.exports = router;
