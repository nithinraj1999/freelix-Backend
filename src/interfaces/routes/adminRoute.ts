import express from 'express'
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { JWT } from '../../application/services/jwt';
import { AdminUseCase } from '../../application/useCases/admin/adminUseCase';
import { AdminRepository } from '../../infrastructure/repositories/adminRepository';
import { AdminController } from '../controllers/adminController';
import { upload } from '../../application/services/multer';
import verifyTokenMiddleware from '../middleware/userAuth';


const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()

const adminRepository = new AdminRepository();

const adminUseCase = new AdminUseCase(adminRepository,bcrypt,jwtToken)
const adminController = new AdminController(adminUseCase,jwtToken);

router.post('/login', adminController.loginAdmin.bind(adminController) );
router.get('/clients-details',verifyTokenMiddleware, adminController.getClientData.bind(adminController) );
router.post('/block-client',verifyTokenMiddleware, adminController.blockClient.bind(adminController) );
router.post('/unblock-client',verifyTokenMiddleware, adminController.unblockClient.bind(adminController) );
router.post('/create-user',verifyTokenMiddleware, upload.single('profilePicture'),adminController.createUser.bind(adminController) );
router.post('/edit-user',verifyTokenMiddleware, upload.single('profilePicture'),adminController.editUser.bind(adminController) );
router.get('/refresh-token', adminController.refreshToken.bind(adminController));

router.get('/freelancers-details',verifyTokenMiddleware, adminController.getFreelancerData.bind(adminController) );
router.post('/create-freelancer',verifyTokenMiddleware,upload.single('profilePicture'), adminController.createFreelancer.bind(adminController) );
router.post('/edit-freelancer',verifyTokenMiddleware,upload.single('profilePicture'), adminController.editFreelancer.bind(adminController) );
router.post('/block-freelancer',verifyTokenMiddleware, adminController.blockFreelancer.bind(adminController) );
router.post('/unblock-freelancer',verifyTokenMiddleware, adminController.unblockFreelancer.bind(adminController) );


export default router