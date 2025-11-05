import { type Request, type Response, Router } from 'express';
import { modulesProvider } from '../modules/ModulesProvider';

const router = Router();
const contactController = modulesProvider.ContactControllerProvider();

router.post('/contact', (req: Request, res: Response) => contactController.addFormInput(req, res));

export default router;
