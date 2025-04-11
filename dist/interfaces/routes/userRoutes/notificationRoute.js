"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationRepository_1 = require("../../../infrastructure/repositories/userRepositories/notificationRepository");
const notificationUseCase_1 = require("../../../application/useCases/user/notificationUseCase/notificationUseCase");
const notificationController_1 = require("../../controllers/userControllers/notificationController/notificationController");
const notification_1 = __importDefault(require("../../../infrastructure/models/notification"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const notificationRepository = new notificationRepository_1.NotificationRepository(notification_1.default);
const notificationUseCase = new notificationUseCase_1.NotificationUseCase(notificationRepository);
const notificationController = new notificationController_1.NotificationController(notificationUseCase);
const router = express_1.default.Router();
router.post('/all-notifications', auth_1.default, notificationController.fetchAllNotifications.bind(notificationController));
exports.default = router;
