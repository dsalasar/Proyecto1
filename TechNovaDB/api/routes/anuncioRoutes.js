const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware , anuncioController.crearAnuncio);
router.get('/', anuncioController.obtenerAnuncios);
router.get('/:id', anuncioController.obtenerAnuncio);
router.put('/:id', anuncioController.actualizarAnuncio);
router.delete('/:id', anuncioController.eliminarAnuncio);

module.exports = router;
