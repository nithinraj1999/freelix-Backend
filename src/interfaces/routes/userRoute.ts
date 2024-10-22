import express from 'express'
import { UserController } from '../controllers/userConctroller';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { EmailService } from '../../application/services/emailService';
import { UserUseCase } from '../../application/useCases/userUseCase';
import { OtpService } from '../../application/services/otpService';
import { JWT } from '../../application/services/jwt';
import { upload } from '../../application/services/multer';
import userAuthMiddleware from '../middleware/auth';

const router = express.Router();

// Set up dependencies
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const emailService = new EmailService()
const otpService = new OtpService()

const userRepository = new UserRepository();

const userUseCase = new UserUseCase(userRepository,bcrypt,emailService,otpService,jwtToken)
const userController = new UserController(userUseCase,jwtToken);


router.post('/signup', userController.register.bind(userController));
router.post('/verification', userController.verification.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.post('/resend-otp', userController.resendOTP.bind(userController));
router.post('/create-job-post',userAuthMiddleware,upload.single('file') ,userController.createJobPost.bind(userController));

export default router




 