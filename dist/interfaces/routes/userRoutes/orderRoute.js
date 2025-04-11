"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderRepository_1 = require("../../../infrastructure/repositories/userRepositories/orderRepository");
const orderUseCase_1 = require("../../../application/useCases/user/orderUseCase/orderUseCase");
const orderController_1 = require("../../controllers/userControllers/orderController/orderController");
const orderModel_1 = __importDefault(require("../../../infrastructure/models/orderModel"));
const escrow_1 = __importDefault(require("../../../infrastructure/models/escrow"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const orderRepository = new orderRepository_1.OrderRepository(orderModel_1.default, escrow_1.default);
const orderUseCase = new orderUseCase_1.OrderUseCase(orderRepository);
const orderController = new orderController_1.OrderController(orderUseCase);
const router = express_1.default.Router();
router.post('/get-all-hiring', auth_1.default, orderController.getAllHiring.bind(orderController));
router.post('/download-file', auth_1.default, orderController.downloadFile.bind(orderController));
exports.default = router;
