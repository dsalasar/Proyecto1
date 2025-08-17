const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');  
require('dotenv').config(); // Carga las variables de entorno del archivo .env

mongoose.connect(process.env.MONGO_URI)

const app = express();
const PORT = 3000;

app.use(cors());
//habilitar body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Montar las rutas
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(` El Servidor esta corriendo en el puerto ${PORT}`);
});