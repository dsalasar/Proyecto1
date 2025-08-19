const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ msg: 'No hay token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ← aquí guardamos el usuario logueado
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = authMiddleware;
