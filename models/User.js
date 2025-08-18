import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'emprendedor', 'usuario'], 
    default: 'usuario' 
  },
  emprendedorProfile: {
    businessName: String,
    description: String,
    category: String,
    contactInfo: {
      phone: String,
      address: String
    },
    isApproved: { type: Boolean, default: false },
    approvalDate: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);