const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', verificarToken, soloAdmin, (req, res) => {
  res.json({ mensaje: 'Bienvenido al panel de administrador' });
});

module.exports = router;
