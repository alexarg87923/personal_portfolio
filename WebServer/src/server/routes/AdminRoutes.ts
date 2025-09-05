import { Router } from 'express';
import { modules } from '../modules/Modules';

const router = Router();
const adminController = modules.getAdminController();

router.post('/admin/login', (req, res) => adminController.login(req, res));
router.post('/admin/logout', (req, res) => adminController.logout(req, res));
router.get('/admin', (req, res, next) => adminController.sessionHandler(req, res, next), (req, res) => adminController.getComponentData(req, res));
router.post('/admin', (req, res, next) => adminController.sessionHandler(req, res, next), (req, res) => adminController.saveComponentData(req, res));

export default router;
