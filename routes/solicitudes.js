import express from 'express';
import { 
  createSolicitud,  // Make sure this exists in your controller
  getSolicitudesPendientes 
} from '../controllers/solicitudes.js';

const router = express.Router();

router.post('/', createSolicitud);  // This handles POST /api/solicitudes
router.get('/', getSolicitudesPendientes);

export default router;