// bakend/api/models/usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    cedula: { type: String, required: true, trim: true, unique: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true 
    },
    password: { type: String, required: true, trim: true },
    rol: { type: String, required: true, default: 'usuario' },
    
    // NUEVO CAMPO PARA (RF1.5)
    activo: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
