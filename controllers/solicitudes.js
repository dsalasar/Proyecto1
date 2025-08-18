
import Solicitud from '../models/Solicitud.js';

export const getSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({ estado: 'pendiente' });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSolicitud = async (req, res) => {
  try {
    const solicitud = new Solicitud({
      ...req.body,
      estado: 'pendiente'  // Default status
    });
    await solicitud.save();
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const aprobarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { estado: 'aprobada' },
      { new: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json({ message: 'Solicitud aprobada', solicitud });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { estado: 'rechazada', motivoRechazo: motivo },
      { new: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json({ message: 'Solicitud rechazada', solicitud });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};