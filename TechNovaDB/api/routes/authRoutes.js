const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); 
const authController = require('../controllers/authController.js'); // Importar el controlador de autenticación

//A pesar de que ya validamos en el modelo, es una buena práctica validar los datos de entrada en las rutas para asegurarnos de que los datos sean correctos antes de procesarlos. Así la base de datos tiene más consistencia y evitamos errores innecesarios.

// Rutas para el registro de usuarios
router.post('/registro', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('apellido1').notEmpty().withMessage('El apellido es obligatorio'),
    check('email').isEmail().withMessage('Por favor ingresa un email válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], authController.registro);

// Rutas para el inicio de sesión de usuarios
router.post('/login', [
    check('email').isEmail().withMessage('Por favor ingresa un email válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
], authController.login);

module.exports = router; // Exportar el router para usarlo en otros archivos