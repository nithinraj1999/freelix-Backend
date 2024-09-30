import express from 'express'
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { JWT } from '../../application/services/jwt';
import { AdminUseCase } from '../../application/useCases/admin/adminUseCase';
import { AdminRepository } from '../../infrastructure/repositories/adminRepository';
import { AdminController } from '../controllers/adminController';
import { upload } from '../../application/services/multer';

const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()

const adminRepository = new AdminRepository();

const adminUseCase = new AdminUseCase(adminRepository,bcrypt,jwtToken)
const adminController = new AdminController(adminUseCase,jwtToken);

router.post('/login', adminController.loginAdmin.bind(adminController) );
router.get('/clients-details', adminController.getClientData.bind(adminController) );
router.post('/block-client', adminController.blockClient.bind(adminController) );
router.post('/unblock-client', adminController.unblockClient.bind(adminController) );
router.post('/create-user', upload.single('profilePicture'),adminController.createUser.bind(adminController) );
router.post('/edit-user', upload.single('profilePicture'),adminController.editUser.bind(adminController) );


router.get('/freelancers-details', adminController.getFreelancerData.bind(adminController) );
router.post('/create-freelancer',upload.single('profilePicture'), adminController.createFreelancer.bind(adminController) );
router.post('/edit-freelancer',upload.single('profilePicture'), adminController.editFreelancer.bind(adminController) );





export default router