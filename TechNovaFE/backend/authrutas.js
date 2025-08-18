const jwt = require('jsonwebtoken');

// Ejemplo dentro del controlador de login
const token = jwt.sign(
  { id: usuario._id, rol: usuario.rol },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
