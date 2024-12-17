import express from 'express'
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { JWT } from '../../application/services/jwt';
import { AdminUseCase } from '../../application/useCases/admin/adminUseCase';
import { AdminRepository } from '../../infrastructure/repositories/adminRepository';
import { AdminController } from '../controllers/adminController';
import { upload } from '../../application/services/multer';
import authMiddleware from '../middleware/userAuth';
import { errorHandlingMiddleware } from '../middleware/errorHandler';
const router = express.Router();
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const adminRepository = new AdminRepository();
const adminUseCase = new AdminUseCase(adminRepository,bcrypt,jwtToken)
const adminController = new AdminController(adminUseCase,jwtToken);


router.post('/login', adminController.loginAdmin.bind(adminController) );
router.get('/clients-details',authMiddleware, adminController.getClientData.bind(adminController) );
router.post('/block-client',authMiddleware, adminController.blockClient.bind(adminController) );
router.post('/unblock-client',authMiddleware, adminController.unblockClient.bind(adminController) );
router.post('/create-user',authMiddleware, upload.single('profilePicture'),adminController.createUser.bind(adminController) );
router.post('/edit-user',authMiddleware, upload.single('profilePicture'),adminController.editUser.bind(adminController) );
router.get('/refresh-token', adminController.refreshToken.bind(adminController));

router.get('/freelancers-details',authMiddleware, adminController.getFreelancerData.bind(adminController) );
router.post('/create-freelancer',authMiddleware,upload.single('profilePicture'), adminController.createFreelancer.bind(adminController) );
router.post('/edit-freelancer',authMiddleware,upload.single('profilePicture'), adminController.editFreelancer.bind(adminController) );
router.post('/block-freelancer',authMiddleware, adminController.blockFreelancer.bind(adminController) );
router.post('/unblock-freelancer',authMiddleware, adminController.unblockFreelancer.bind(adminController));
router.post('/add-skills',authMiddleware, adminController.addSkills.bind(adminController));
router.get('/dashboard-data',authMiddleware, adminController.getDashboardData.bind(adminController));
router.get('/get-all-skills',authMiddleware,adminController.getAllSkills.bind(adminController));

// router.use(errorHandlingMiddleware); // Place it here

export default router