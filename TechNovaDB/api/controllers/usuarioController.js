// controllers/userController.js
const Usuario = require('../models/Usuario');

// Obtener datos del usuario logeado
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // asumimos que usas middleware de auth que agrega req.user
    const user = await Usuario.findById(userId).select('-password'); // sin la contraseña
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Actualizar datos del usuario
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido1, apellido2, correo } = req.body;

    const user = await Usuario.findByIdAndUpdate(
      userId,
      { nombre, apellido1, apellido2, correo },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ msg: 'Datos actualizados', user });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar' });
  }
};
