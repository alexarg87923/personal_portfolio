import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';

const router = Router();
const contactController = new ContactController();

router.post('/contact', (req, res) => contactController.addFormInput(req, res));

export default router;
