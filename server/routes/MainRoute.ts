import { Router } from 'express';
import { MainController } from '../controllers/MainController';

const router = Router();
const mainController = new MainController();

router.get('/main', (req, res) => mainController.getPortfolioData(req, res));

export default router;
