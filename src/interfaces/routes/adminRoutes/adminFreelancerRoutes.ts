import express from 'express'
import authMiddleware from '../../middleware/userAuth';
import { FreelancerAdminRepository } from '../../../infrastructure/repositories/adminRepository/freelancerAdminRepository';
import { AdminFreelancerController } from '../../controllers/adminController/freelancerController';
import { AdminFreelancerUseCase } from '../../../application/useCases/admin/adminFreelancerUseCase';
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import { JWT } from '../../../application/services/jwt';
import { upload } from '../../../application/services/multer';

const router = express.Router();
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const freelancerAdminRepository =new FreelancerAdminRepository()
const adminFreelancerUseCase = new AdminFreelancerUseCase(freelancerAdminRepository,bcrypt)
const adminFreelancerController = new AdminFreelancerController(adminFreelancerUseCase)

router.get('/freelancers-details',authMiddleware, adminFreelancerController.getFreelancerData.bind(adminFreelancerController) );
router.post('/create-freelancer',authMiddleware,upload.single('profilePicture'), adminFreelancerController.createFreelancer.bind(adminFreelancerController) );
router.post('/edit-freelancer',authMiddleware,upload.single('profilePicture'), adminFreelancerController.editFreelancer.bind(adminFreelancerController) );
router.post('/block-freelancer',authMiddleware, adminFreelancerController.blockFreelancer.bind(adminFreelancerController) );
router.post('/unblock-freelancer',authMiddleware, adminFreelancerController.unblockFreelancer.bind(adminFreelancerController));



export default router