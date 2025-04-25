import express from 'express'
import { UserController } from '../../controllers/userControllers/userConctroller';
import { UserRepo } from '../../../infrastructure/repositories/userRepositories/userRepo';
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import { EmailService } from '../../../application/services/emailService';
import { UserUseCase } from '../../../application/useCases/userUseCase';
import { OtpService } from '../../../application/services/otpService';
import { JWT } from '../../../application/services/jwt';
import { upload } from '../../../application/services/multer';
import userAuthMiddleware from '../../middleware/auth';
import userModel from '../../../infrastructure/models/userModel';
const router = express.Router();

// Set up dependencies
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const emailService = new EmailService()
const otpService = new OtpService()
const userRepository = new UserRepo(userModel);
const userUseCase = new UserUseCase(userRepository,bcrypt,emailService,otpService,jwtToken)
const userController = new UserController(userUseCase,jwtToken);

router.post('/freelancer-details',userAuthMiddleware, userController.fetchFreelancerDetails.bind(userController));
router.post('/forget-password',userController.forgetPassword.bind(userController));
router.post('/reset-password',userController.resetPassword.bind(userController));
router.post('/get-userdata',userAuthMiddleware,userController.getUserData.bind(userController));
router.put('/edit-profile',userAuthMiddleware,upload.single('profilePicture'),userController.editData.bind(userController));

 

export default router 

 
   

 