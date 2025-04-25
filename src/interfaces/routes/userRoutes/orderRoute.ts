import express from 'express'
import { OrderRepository } from '../../../infrastructure/repositories/userRepositories/orderRepository';
import { OrderUseCase } from '../../../application/useCases/user/orderUseCase/orderUseCase';
import { OrderController } from '../../controllers/userControllers/orderController/orderController';

import OrderModel from '../../../infrastructure/models/orderModel';
import EscrowModel from '../../../infrastructure/models/escrow';

import userAuthMiddleware from '../../middleware/auth';
const orderRepository = new OrderRepository(OrderModel,EscrowModel)
const orderUseCase = new OrderUseCase(orderRepository)
const orderController = new OrderController(orderUseCase)

const router = express.Router();




router.post('/get-all-hiring',userAuthMiddleware,orderController.getAllHiring.bind(orderController));
router.post('/download-file',userAuthMiddleware,orderController.downloadFile.bind(orderController));


export default router