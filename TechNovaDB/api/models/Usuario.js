const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator'); // Importar el validador de email

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true // Elimina espacios en blanco al inicio y al final
        },
    apellido1: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
        },
    apellido2: {
        type: String,
        trim: true
        },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Por favor ingresa un email válido'] // Validar el formato del email
        },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        select: false, // No mostrar la contraseña en las respuestas
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
        },
    fechaRegistro: {
        type: Date,
        default: Date.now
        },
    role: {
        type: String,
        enum: ['admin', 'ciudadano', 'emprendedor'],
        default: 'ciudadano'
        }
});


// Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) { // Este middleware se ejecuta antes de guardar un documento
  if (!this.isModified('password')) return next(); // Si la contraseña no ha sido modificada, no hacemos nada. Si no existe en la base de datos, la hasheamos.
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema); // Exportar el modelo Usuario
