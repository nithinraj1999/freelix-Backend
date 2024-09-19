import express from 'express'
import { UserController } from '../controllers/userConctroller';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { EmailService } from '../../application/services/emailService';
import { UserUseCase } from '../../application/useCases/userUseCase';
import { OtpService } from '../../application/services/otpService';

const router = express.Router();


// Set up dependencies
const bcrypt = new BcryptPasswordHasher(10);
const userRepository = new UserRepository();
const emailService = new EmailService()
const otpService = new OtpService()

const userUseCase = new UserUseCase(userRepository,bcrypt,emailService,otpService)

const userController = new UserController(userUseCase);

// Define the registration route
router.post('/register', userController.register.bind(userController));


export default router




 