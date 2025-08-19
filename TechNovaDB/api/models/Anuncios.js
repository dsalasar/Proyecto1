const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagenes: {
        type: [String], // Array de URLs o nombres de archivos
        default: []
    },
    categoria: {
        type: String,
        enum: ['noticia', 'reporte', 'anuncio'],
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobado', 'rechazado'],
        default: 'pendiente'
    },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true } // ← NUEVO
}, { timestamps: true });

module.exports = mongoose.model('Anuncio', anuncioSchema);
