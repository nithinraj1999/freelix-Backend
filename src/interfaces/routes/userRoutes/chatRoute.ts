import express from 'express'
import { Chatrepository } from '../../../infrastructure/repositories/userRepositories/chatRepository';
import { ChatUseCase } from '../../../application/useCases/user/chatUseCase/chatUseCase';
import { ChatController } from '../../controllers/userControllers/chatController/chatController';
import MessageModel from '../../../infrastructure/models/message';
import { upload } from '../../../application/services/multer';

const chatRepository = new Chatrepository(MessageModel)
const chatUseCase = new ChatUseCase(chatRepository)
const chatController = new ChatController(chatUseCase)

const router = express.Router();



router.post('/get-all-contacts',chatController.fetchAllContacts.bind(chatController));
router.get('/get-chat',chatController.fetchChat.bind(chatController));
router.post('/file-upload',upload.single('file'),chatController.uploadFile.bind(chatController));
router.post('/download-attachment',chatController.downloadAttachment.bind(chatController));






export default router
