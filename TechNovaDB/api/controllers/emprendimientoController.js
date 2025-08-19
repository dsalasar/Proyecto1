const Emprendimiento = require('../models/Emprendimiento');

// Crear un nuevo emprendimiento
exports.crearEmprendimiento = async (req, res) => {
  try {
    const { nombre, descripcion, telefono, horario, direccion, categoria, emprendedor } = req.body;

    const nuevoEmprendimiento = new Emprendimiento({
      nombre,
      descripcion,
      telefono,
      horario,
      direccion,
      categoria,
      emprendedor
    });

    const savedEmprendimiento = await nuevoEmprendimiento.save();
    res.status(201).json(savedEmprendimiento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el emprendimiento', error });
  }
};

// Obtener todos los emprendimientos
exports.obtenerEmprendimientos = async (req, res) => {
  try {
    const emprendimientos = await Emprendimiento.find().populate('emprendedor', 'nombre email'); // opcional, mostrar datos del usuario
    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener emprendimientos', error });
  }
};

// Obtener un emprendimiento por ID
exports.obtenerEmprendimientoPorId = async (req, res) => {
  try {
    const emprendimiento = await Emprendimiento.findById(req.params.id).populate('emprendedor', 'nombre email');
    if (!emprendimiento) return res.status(404).json({ mensaje: 'Emprendimiento no encontrado' });
    res.json(emprendimiento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el emprendimiento', error });
  }
};

// Actualizar un emprendimiento
exports.actualizarEmprendimiento = async (req, res) => {
  try {
    const { nombre, descripcion, telefono, horario, direccion, categoria, estado } = req.body;

    const emprendimientoActualizado = await Emprendimiento.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, telefono, horario, direccion, categoria, estado },
      { new: true }
    );

    if (!emprendimientoActualizado) return res.status(404).json({ mensaje: 'Emprendimiento no encontrado' });
    res.json(emprendimientoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el emprendimiento', error });
  }
};

// Eliminar un emprendimiento
exports.eliminarEmprendimiento = async (req, res) => {
  try {
    const eliminado = await Emprendimiento.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Emprendimiento no encontrado' });
    res.json({ mensaje: 'Emprendimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el emprendimiento', error });
  }
};

// actualizar estado 

// controller
exports.actualizarEstadoEmprendimiento = async (req, res) => {
  try {
    const { estado } = req.body;
    const empr = await Emprendimiento.findById(req.params.id);
    if (!empr) return res.status(404).json({ msg: 'Emprendimiento no encontrado' });
    
    empr.estado = estado;
    await empr.save();
    
    res.json(empr);
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar el estado', error: err.message });
  }
};
