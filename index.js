const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
const routesPersonas = require("./routes/routesPersonas")
const routesProductos = require("./routes/routesProductos")
const routesAuth = require("./routes/auth")
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)

const app = express()
const port = 3000

//habilitar cors
app.use(cors())

//habilitar body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// servir archivos estáticos desde la carpeta public
app.use(express.static('public'));



app.use("/",routesPersonas);
app.use("/",routesProductos)
app.use("/",routesAuth)

app.listen(port, () => {
  console.log(`La aplicacion esta corriendo en el puerto ${port}`)
})
