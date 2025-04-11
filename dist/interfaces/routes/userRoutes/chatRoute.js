"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRepository_1 = require("../../../infrastructure/repositories/userRepositories/chatRepository");
const chatUseCase_1 = require("../../../application/useCases/user/chatUseCase/chatUseCase");
const chatController_1 = require("../../controllers/userControllers/chatController/chatController");
const message_1 = __importDefault(require("../../../infrastructure/models/message"));
const chatRepository = new chatRepository_1.Chatrepository(message_1.default);
const chatUseCase = new chatUseCase_1.ChatUseCase(chatRepository);
const chatController = new chatController_1.ChatController(chatUseCase);
const router = express_1.default.Router();
router.post('/get-all-contacts', chatController.fetchAllContacts.bind(chatController));
router.get('/get-chat', chatController.fetchChat.bind(chatController));
exports.default = router;
