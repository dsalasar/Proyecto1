const mongoose = require('mongoose');

const EmprendimientoSchema = new mongoose.Schema({
    nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  horario: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ['aprobado', 'pendiente', 'rechazado'],
    default: 'pendiente',
  },
  emprendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Emprendimiento', EmprendimientoSchema);