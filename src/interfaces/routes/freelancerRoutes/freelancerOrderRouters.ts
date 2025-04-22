import express from 'express'
import freelancerAuth from '../../middleware/freelancerAuth';

import { FreelancerOrderRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerOrderRepository';
import { FreelancerOrderUseCase } from '../../../application/useCases/freelancer/freelancerOrderRepository';
import { FreelancerOrderController } from '../../controllers/freelancerController/freelancerOrderController';

import OrderModel from '../../../infrastructure/models/orderModel';
import { upload } from '../../../application/services/multer';
const router = express.Router();


const freelancerOrderRepository = new FreelancerOrderRepository(OrderModel)
const freelancerOrderUseCase = new FreelancerOrderUseCase(freelancerOrderRepository)
const freelancerOrderController =new FreelancerOrderController(freelancerOrderUseCase)


router.post('/my-orders',freelancerAuth,freelancerOrderController.getMyOrders.bind(freelancerOrderController));
router.post('/complete-order',freelancerAuth,upload.single('file'),freelancerOrderController.completeOrder.bind(freelancerOrderController));
export default router