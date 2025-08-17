require('dotenv').config(); // Cargar variables de entorno desde el archivo .env
const express = require('express'); // Importar express
const cors = require('cors'); // Importar cors para manejar CORS
const mongoose = require('mongoose'); // Importar mongoose para manejar la conexión a MongoDB
const bodyParser = require('body-parser'); // Importar body-parser para manejar el cuerpo de las solicitudes

// importar rutas 
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación

const app = express(); // Crear una instancia de express

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json()); // Parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear el cuerpo de las solicitudes con URL codificada

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI) // Conectamos a MongoDB utilizando la URI de conexión que está en el archivo .env con nuestra contraseña
  .then(() => console.log('Conectado a MongoDB')) // Mensaje de éxito si logra conectar
  .catch(err => console.error('Error conectando a MongoDB:', err)); // Mensaje de error por si no logra conectar

//RUTAS 
app.use('/api/auth', authRoutes); // Rutas de autenticación

// Rutas básicas
app.get('/', (req, res) => { // Ruta raíz
  res.json({ message: 'API funcionando' }); // Respuesta JSON simple
}); 

// Manejo de errores
app.use((err, req, res, next) => { //Este middleware funciona de la siguiente manera: si hay un error en cualquier parte de la aplicación, este middleware lo captura y envía una respuesta al cliente.
  console.error(err.stack); // Imprimir el error en la consola
  res.status(500).json({ error: 'Algo salió mal!' }); // Enviar una respuesta JSON con un mensaje de error
});

// Iniciar servidor
const PORT = process.env.PORT || 3000; // Definir el puerto en el que se ejecutará la aplicación, si no está definido en las variables de entorno, usará el puerto 3000
app.listen(PORT, () => { 
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de éxito al iniciar el servidor
});