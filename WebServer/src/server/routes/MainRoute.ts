import { type Request, type Response, Router } from 'express';
import ContactRoutes from './ContactRoutes';
import AdminRoutes from './AdminRoutes';
import { modules } from '../modules/Modules';

const router = Router();
const mainController = modules.getMainController();

router.get('/', (req: Request, res: Response) => mainController.getPortfolioData(req, res));
router.use(ContactRoutes);
router.use(AdminRoutes);


export default router;
