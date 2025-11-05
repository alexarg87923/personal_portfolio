import { type Request, type Response, type NextFunction, Router } from 'express';
import { modulesProvider } from '../modules/ModulesProvider';

const router = Router();
const adminController = modulesProvider.AdminControllerProvider();

router.post('/admin/login', (req: Request, res: Response) => adminController.login(req, res));
router.post('/admin/logout', (req: Request, res: Response) => adminController.logout(req, res));
router.get('/admin', (req: Request, res: Response, next: NextFunction) => adminController.sessionHandler(req, res, next), (req, res) => adminController.getComponentData(req, res));
router.post('/admin', (req: Request, res: Response, next: NextFunction) => adminController.sessionHandler(req, res, next), (req, res) => adminController.saveComponentData(req, res));

export default router;
