import express from 'express'
import { ClientAdminRepository } from '../../../infrastructure/repositories/adminRepository/clientAdminRepository';
import { AdminClientUseCase } from '../../../application/useCases/admin/adminClientUseCase';
import { ClientController } from '../../controllers/adminController/clientController';
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import authMiddleware from '../../middleware/userAuth';
import { upload } from '../../../application/services/multer';

const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);

const clientAdminRepository = new ClientAdminRepository()
const adminClientUseCase = new AdminClientUseCase(clientAdminRepository,bcrypt)
const adminClientController = new ClientController(adminClientUseCase)

router.get('/clients-details',authMiddleware, adminClientController.getClientData.bind(adminClientController) );
router.post('/block-client',authMiddleware, adminClientController.blockClient.bind(adminClientController) );
router.post('/unblock-client',authMiddleware, adminClientController.unblockClient.bind(adminClientController) );
router.post('/create-user',authMiddleware, upload.single('profilePicture'),adminClientController.createUser.bind(adminClientController) );
router.post('/edit-user',authMiddleware, upload.single('profilePicture'),adminClientController.editUser.bind(adminClientController) );


export default router