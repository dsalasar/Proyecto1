import express from 'express';
import Transporte from '../models/Transporte.js';

const router = express.Router();

// GET todas las rutas con manejo de timeout
router.get('/', async (req, res) => {
  try {
    // Configurar timeout para esta operación específica
    const rutas = await Transporte.find().maxTimeMS(20000);
    res.json(rutas);
  } catch (err) {
    console.error('Error al obtener rutas:', err);
    
    if (err.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ 
        success: false,
        message: 'Error al conectar con la base de datos',
        error: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las rutas',
      error: err.message
    });
  }
});



// POST crear nueva ruta
router.post('/', async (req, res) => {
  try {
    const ruta = new Transporte(req.body);
    const nuevaRuta = await ruta.save();
    res.status(201).json(nuevaRuta);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET una ruta específica
router.get('/:id', async (req, res) => {
  try {
    const ruta = await Transporte.findById(req.params.id);
    if (!ruta) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.json(ruta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const rutaActualizada = await Transporte.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!rutaActualizada) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    res.json(rutaActualizada);
  } catch (err) {
    console.error('Error al actualizar:', err);
    res.status(400).json({ 
      message: 'Error al actualizar la ruta',
      error: err.message 
    });
  }
});

// DELETE eliminar ruta
router.delete('/:id', async (req, res) => {
  try {
    const ruta = await Transporte.findByIdAndDelete(req.params.id);
    if (!ruta) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.json({ message: 'Ruta eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;