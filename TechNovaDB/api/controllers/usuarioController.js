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
    const { nombre, apellido1, apellido2, email } = req.body;

    const user = await Usuario.findByIdAndUpdate(
      userId,
      { nombre, apellido1, apellido2, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ msg: 'Datos actualizados', user });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar' });
  }
};

// const Usuario = require('../models/Usuario');

// 🔹 Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password'); // excluir contraseña
    return res.status(200).json(usuarios);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al obtener usuarios', error: err.message });
  }
};

// 🔹 Obtener perfil del usuario logeado
exports.getUserProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-password');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    return res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al obtener usuario', error: err.message });
  }
};

// 🔹 Actualizar usuario por ID (Admin)
exports.updateUserById = async (req, res) => {
  try {
    const { nombre, apellido1, apellido2, email, role } = req.body;

    const updatedUser = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido1, apellido2, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    return res.status(200).json({ msg: 'Usuario actualizado correctamente', usuario: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al actualizar usuario', error: err.message });
  }
};

// 🔹 Obtener usuario por ID (Admin o para edición)
exports.getUserById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    return res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al obtener usuario', error: err.message });
  }
};

// DELETE /api/miusuario/eliminar/:id
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await Usuario.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Usuario no encontrado' });
    return res.status(200).json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('[deleteUserById] ', err);
    return res.status(500).json({ msg: 'Error al eliminar usuario', error: err.message });
  }
};
