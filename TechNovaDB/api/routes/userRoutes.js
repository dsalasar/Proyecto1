const express = require('express');
const router = express.Router();

const { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  updateUserById, 
  getUserById, 
  deleteUserById 
} = require('../controllers/usuarioController');

const authMiddleware = require('../middlewares/authMiddleware');

// Rutas de perfil propio
router.get('/me', authMiddleware, getUserProfile);     // Obtener perfil propio
router.put('/me', authMiddleware, updateUserProfile);  // Actualizar perfil propio

// Rutas de administración de usuarios
router.get('/', authMiddleware, getAllUsers);          // Obtener todos los usuarios
router.get('/obtener/:id', authMiddleware, getUserById); // Obtener usuario por ID
router.put('/actualizar/:id', authMiddleware, updateUserById); // Actualizar usuario por ID
router.delete('/eliminar/:id', authMiddleware, deleteUserById); // Eliminar usuario por ID

module.exports = router;
