import { Router } from 'express';
import { MainController } from '../controllers/MainController';
import ContactRoutes from './ContactRoutes';
import AdminRoutes from './AdminRoutes';

const router = Router();
const mainController = new MainController();

router.get('/', (req, res) => mainController.getPortfolioData(req, res));
router.use(ContactRoutes);
router.use(AdminRoutes);


export default router;
