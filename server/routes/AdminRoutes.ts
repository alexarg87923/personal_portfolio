import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';

const router = Router();
const adminController = new AdminController();

router.post('/admin/login', (req, res) => adminController.login(req, res));
router.post('/admin/logout', (req, res) => adminController.logout(req, res));
router.get('/admin', (req, res) => adminController.getComponentData(req, res));

export default router;
