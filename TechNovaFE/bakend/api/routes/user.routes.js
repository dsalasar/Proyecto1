// backend/api/routes/user.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// RF1.1 / RF1.3  Registro
// POST http://localhost:3000/api/users/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, cedula, email, password } = req.body;
    if (!nombre || !apellido || !cedula || !email || !password) {
      return res.status(400).json({ msg: 'Debe llenar todos los campos requeridos' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'El formato del correo electrónico no es válido' });
    }

    const existente = await User.findOne({ $or: [{ cedula }, { email }] });
    if (existente) {
      const msg = existente.cedula === cedula
        ? 'Ya existe un usuario con esta cédula'
        : 'Ya existe un usuario con este correo electrónico';
      return res.status(400).json({ msg });
    }

    const nuevo = new User({ nombre, apellido, cedula, email, password, rol: 'usuario' });
    await nuevo.save();
    return res.status(201).json({ msg: 'Usuario registrado exitosamente', usuario: nuevo });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Error al registrar el usuario', error: e.message });
  }
});

// RF1.2  Login
//  POST http://localhost:3000/api/users/login
router.post('/login', async (req, res) => {
  try {
    const identifierRaw = req.body.email || '';   // en el front el campo se llama "email"
    const password      = req.body.password || '';

    if (!identifierRaw || !password) {
      return res.status(400).json({ msg: 'Debe llenar los campos requeridos' });
    }

    const norm = s => (s || '').trim().toLowerCase();
    const isEmail = identifierRaw.includes('@');

    const email  = norm(identifierRaw);
    const cedula = (identifierRaw || '').trim();  
    const user = await User.findOne(isEmail ? { email } : { cedula });

    if (!user || user.password !== password) {
      return res.status(401).json({ msg: 'Usuario y/o contraseña inválidos' });
    }
    
 //restaurar si estaba inactivo (soft delete)
    if (user.activo === false) {
      user.activo = true;
      await user.save();
    }

    return res.status(200).json({ msg: 'Inicio de sesión exitoso', user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Error al iniciar sesión', error: e.message });
  }
});

// Listado (admin) activos por defecto
// GET  http://localhost:3000/api/users/register/api/users  (?includeDeleted=true para ver todos)
router.get('/', async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const filter = includeDeleted ? {} : { activo: true };
    const users = await User.find(filter).select('-password');
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Error al obtener usuarios', error: e.message });
  }
}); 

// Obtener uno (apoya el RF1.4)
// GET http://localhost:3000/api/users/:idd
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.activo === false) return res.status(404).json({ msg: 'Usuario no encontrado' });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Error al obtener el usuario', error: e.message });
  }
});

// RF1.4  Editar perfil PUT
// PUT http://localhost:3000/api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { nombre, apellido, cedula, email, ubicacion } = req.body;

    if (!nombre || !apellido || !cedula || !email) {
      return res.status(400).json({ msg: 'Debe llenar todos los campos requeridos' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ msg: 'El formato del correo electrónico no es válido' });
    const nombreRegex = /^[A-Za-z\s]+$/;
    if (!nombreRegex.test(nombre)) return res.status(400).json({ msg: 'El nombre no debe contener números' });

    const dup = await User.findOne({ $or: [{ cedula }, { email }], _id: { $ne: req.params.id } });
    if (dup) {
      const msg = dup.cedula === cedula ? 'Ya existe un usuario con esta cédula' : 'Ya existe un usuario con este correo electrónico';
      return res.status(400).json({ msg });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, cedula, email, ubicacion },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Usuario no encontrado' });

    return res.status(200).json({ msg: 'Perfil actualizado exitosamente', usuario: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Error al actualizar el perfil', error: e.message });
  }
});

// RF1.5  Eliminación (soft delete 30 días)
// DELETE  http://localhost:3000/api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.activo = false;
    //    RF5: user.estado = 'PENDIENTE_ELIMINACION'; user.purgeAt = new Date(Date.now() + 30*24*60*60*1000);
    await user.save();

    return res.status(200).json({ msg: 'Perfil marcado para eliminación exitosamente' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Error al solicitar la eliminación', error: e.message });
  }
});

module.exports = router;