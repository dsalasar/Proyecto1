import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true },
  motivo: { type: String, required: true },
  ubicacion: { type: String, required: true },
  tipo: { type: String, enum: ['emprendedor'], default: 'emprendedor' },
  estado: { 
    type: String, 
    enum: ['pendiente', 'aprobada', 'rechazada'], 
    default: 'pendiente' 
  },
  motivoRechazo: { type: String },
  fechaCreacion: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model('Solicitud', solicitudSchema);