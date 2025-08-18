import mongoose from 'mongoose';

const transporteSchema = new mongoose.Schema({
  empresa: { type: String, required: true },
  tipo: { type: String, required: true, enum: ['Bus', 'Taxi', 'Tren'] },
  horario: { type: String, required: true },
  contacto: { type: String, required: true },
  rutas: { type: String, required: true },
  imagen: { type: String, required: false },
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
  
});

export default mongoose.model('Transporte', transporteSchema);