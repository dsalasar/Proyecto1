import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import transporteRoutes from './routes/transporte.js';
import solicitudesRoutes from './routes/solicitudes.js';

dotenv.config();

const app = express();

// Configuración de CORS más estricta
app.use(cors({
  origin: ['http://localhost:5502', 'http://192.168.56.1:5502'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());



// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/transporte', transporteRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} to ${req.url}`);
  next();
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));