import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Obtener emprendedores pendientes de aprobación
router.get('/emprendedores/pendientes', async (req, res) => {
  try {
    const emprendedores = await User.find({
      role: 'emprendedor',
      'emprendedorProfile.isApproved': false
    }).select('-password');

    res.json(emprendedores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Aprobar perfil de emprendedor
router.put('/emprendedores/:id/aprobar', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body; // ID del administrador que aprueba

    const emprendedor = await User.findByIdAndUpdate(
      id,
      { 
        'emprendedorProfile.isApproved': true,
        'emprendedorProfile.approvalDate': new Date(),
        'emprendedorProfile.approvedBy': adminId
      },
      { new: true }
    );

    if (!emprendedor) {
      return res.status(404).json({ message: 'Emprendedor no encontrado' });
    }

    res.json(emprendedor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rechazar perfil de emprendedor
router.put('/emprendedores/:id/rechazar', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Razón del rechazo

    const emprendedor = await User.findByIdAndUpdate(
      id,
      { 
        'emprendedorProfile.isApproved': false,
        'emprendedorProfile.rejectionReason': reason,
        'emprendedorProfile.rejectionDate': new Date()
      },
      { new: true }
    );

    if (!emprendedor) {
      return res.status(404).json({ message: 'Emprendedor no encontrado' });
    }

    res.json(emprendedor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;