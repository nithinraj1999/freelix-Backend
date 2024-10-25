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
import validateSchema from '../middleware/validator';
import { signupSchema } from '../../domain/validation/validation';
import { jobCreationSchema } from '../../domain/validation/validation';
import { loginSchema } from '../../domain/validation/validation';
const router = express.Router();

// Set up dependencies
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const emailService = new EmailService()
const otpService = new OtpService()

const userRepository = new UserRepository();

const userUseCase = new UserUseCase(userRepository,bcrypt,emailService,otpService,jwtToken)
const userController = new UserController(userUseCase,jwtToken);


router.post('/signup',validateSchema(signupSchema), userController.register.bind(userController));
router.post('/verification', userController.verification.bind(userController));
router.post('/login',validateSchema(loginSchema), userController.loginUser.bind(userController));
router.post('/resend-otp', userController.resendOTP.bind(userController));
router.post('/create-job-post',upload.single('file'),validateSchema(jobCreationSchema) ,userController.createJobPost.bind(userController));
router.post('/my-job-posts',userAuthMiddleware,userController.getAllJobPosts.bind(userController));
router.post('/delete-post',userAuthMiddleware,userController.deletePost.bind(userController));
router.post('/edit-post',userAuthMiddleware,userController.editPost.bind(userController));

export default router 

 
  

 