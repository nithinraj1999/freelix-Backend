import express from 'express'
import userAuthMiddleware from '../../middleware/auth';
import { PaymentRepository } from '../../../infrastructure/repositories/userRepositories/paymentRepository';
import { PaymentUseCase } from '../../../application/useCases/user/paymentUseCase/paymentUseCase';
import { PaymentController } from '../../controllers/userControllers/paymentController/paymentController';
import { OrderUseCase } from '../../../application/useCases/user/orderUseCase/orderUseCase';
import EscrowModel from '../../../infrastructure/models/escrow';
import WalletModel from '../../../infrastructure/models/wallet';
import OrderModel from '../../../infrastructure/models/orderModel';

import { OrderRepository } from '../../../infrastructure/repositories/userRepositories/orderRepository';

const paymentRepository = new PaymentRepository(EscrowModel,WalletModel,OrderModel)
const orderRepository = new OrderRepository(OrderModel,EscrowModel)
const orderUseCase = new OrderUseCase(orderRepository)
const paymentUseCase = new PaymentUseCase(paymentRepository)
const paymentController = new PaymentController(orderUseCase,paymentUseCase)
const router = express.Router();

router.post('/make-payment',userAuthMiddleware,paymentController.makePayment.bind(paymentController));
router.post('/release-payment',userAuthMiddleware,paymentController.releasePayment.bind(paymentController));


export default router