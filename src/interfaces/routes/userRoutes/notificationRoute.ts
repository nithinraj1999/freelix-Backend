import express from 'express'
import { NotificationRepository } from '../../../infrastructure/repositories/userRepositories/notificationRepository';
import { NotificationUseCase } from '../../../application/useCases/user/notificationUseCase/notificationUseCase';
import { NotificationController } from '../../controllers/userControllers/notificationController/notificationController';
import notificationModel from '../../../infrastructure/models/notification';
import userAuthMiddleware from '../../middleware/auth';


const notificationRepository = new NotificationRepository(notificationModel)
const notificationUseCase = new NotificationUseCase(notificationRepository)
const notificationController = new NotificationController(notificationUseCase)

const router = express.Router();

router.post('/all-notifications',userAuthMiddleware, notificationController.fetchAllNotifications.bind(notificationController));

export default router