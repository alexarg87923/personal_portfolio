import { Router } from 'express';
import { modules } from '../modules/Modules';

const router = Router();
const contactController = modules.getContactController();

router.post('/contact', (req, res) => contactController.addFormInput(req, res));

export default router;
