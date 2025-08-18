const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken"); // Importar el modelo de Usuario y jsonwebtoken para manejar la autenticación
const { validationResult, ExpressValidator } = require("express-validator"); // Importar validationResult para manejar las validaciones

//helper function para generar un token JWT
const generateToken = (id) => {
  return jwt.sign(
    { id }, // El payload del token contiene el ID del usuario
    process.env.JWT_SECRET, // La clave secreta para firmar el token, debe estar en las variables de entorno
    { expiresIn: "30d" } // El token expirará en 30 dias
  );
};

//Registrar usuario
//route POST /api/auth/register
//access public

// Controlador para el registro de usuarios
exports.registro = async (req, res, next) => {
  // Función para manejar el registro de usuarios recibe
  // 1. validad errores de ExpressValidator
  const errors = validationResult(req); // Validar los datos de entrada
  if (!errors.isEmpty()) {
    // Si hay errores de validación
    return res.status(400).json({ errors: errors.array() }); // Enviar una respuesta con los errores
  }

  const { nombre, apellido1, apellido2, email, password} = req.body; // Desestructurar los datos del cuerpo de la solicitud

  try {
    // 2. Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email }); // Buscar un usuario con el mismo email
    if (usuarioExistente) {
      // Si el usuario ya existe
      return res.status(400).json({ msg: "El usuario ya existe" }); // Enviar un mensaje de error
    }

    // 3. Crear un nuevo usuario
    const usuario = await Usuario.create({
      // Crear una nueva instancia del modelo Usuario
      nombre,
      apellido1,
      apellido2,
      email,
      password, // La contraseña será hasheada por el middleware en el modelo
        role: "ciudadano", // Asignar el rol por defecto
    });

    //4. Generar un token JWT
    const token = generateToken(usuario._id); // Generar un token JWT con el ID del usuario

    // 5. Responder con el usuario y el token
    res.status(201).json({
      // Enviar una respuesta con el usuario y el token
      _id: usuario._id,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      email: usuario.email,
      role: usuario.role,
      token, // Enviar el token JWT
    });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

//Autenticar usuario
//route POST /api/auth/login
//access public

// Controlador para el inicio de sesión de usuarios
exports.login = async (req, res, next) => {
  // Función para manejar el inicio de sesión de usuarios
  // 1. Validar errores de ExpressValidator
  const errors = validationResult(req); // Validar los datos de entrada
  if (!errors.isEmpty()) {
    // Si hay errores de validación
    return res.status(400).json({ errors: errors.array() }); // Enviar una respuesta con los errores
  }

  const { email, password } = req.body; // Desestructurar los datos del cuerpo de la solicitud

  try {
    // 2. Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email }).select("+password"); // Buscar un usuario con el email proporcionado y seleccionar la contraseña para poder compararla, el + indica que queremos incluir la contraseña en el resultado ya que marcamos en el modelo que no se debe mostrar por defecto, esto lo anula temporalmente para esta consulta
    if (!usuario) {
      // Si el usuario no existe
      return res.status(401).json({ msg: "Email no Registrado" }); // Enviar un mensaje de error
    }

    // 3. Comparar la contraseña
    const isMatch = await usuario.comparePassword(password); // Comparar la contraseña proporcionada con la almacenada en la base de datos. Esta función está definida en el modelo Usuario y utiliza bcrypt para comparar las contraseñas.
    if (!isMatch) {
      // Si la contraseña no coincide
      return res.status(401).json({ msg: "Contraseña Incorrecta" }); // Enviar un mensaje de error
    }

    // 4. Generar un token JWT
    const token = generateToken(usuario._id); // Generar un token JWT con el ID del usuario

    // 5. Responder con el usuario y el token
    res.status(200).json({
      // Enviar una respuesta con el usuario y el token
      _id: usuario._id,
      email: usuario.email,
    //   role: usuario.role,
      token, // Enviar el token JWT
    });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};
