import express from 'express'
import authMiddleware from '../../middleware/userAuth';
import { DashboardAdminRepository } from '../../../infrastructure/repositories/adminRepository/dashboardAdminRepository';
import { AdminDashboardUseCase } from '../../../application/useCases/admin/adminDashboardUseCase';
import { DashboardController } from '../../controllers/adminController/dashboardController';

const router = express.Router();

const dashboardAdminRepository = new DashboardAdminRepository()
const adminDashboardUseCase = new AdminDashboardUseCase(dashboardAdminRepository)
const dashboardController = new DashboardController(adminDashboardUseCase)

router.get('/dashboard-data',authMiddleware, dashboardController.getDashboardData.bind(dashboardController));

export default router