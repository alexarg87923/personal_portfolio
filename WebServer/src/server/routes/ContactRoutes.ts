import { type Request, type Response, Router } from 'express';
import { modules } from '../modules/Modules';

const router = Router();
const contactController = modules.getContactController();

router.post('/contact', (req: Request, res: Response) => contactController.addFormInput(req, res));

export default router;
