import express from 'express'
import { SignupController } from '../../../controllers/userControllers/authControllers/signupController'
import { UserRepo } from '../../../../infrastructure/repositories/userRepositories/userRepo'
import { BcryptPasswordHasher } from '../../../../application/services/bcrypt'
import { EmailService } from '../../../../application/services/emailService'
import { OtpService } from '../../../../application/services/otpService'
import { JWT } from '../../../../application/services/jwt'
import validateSchema from '../../../middleware/validator'
import { signupSchema } from '../../../../domain/validation/validation'
import { SignupUseCase } from '../../../../application/useCases/user/authUseCases/signupUseCase'
import userModel from '../../../../infrastructure/models/userModel'
import Otp from '../../../../infrastructure/models/otpModel'
import { OTPRepository } from '../../../../infrastructure/repositories/userRepositories/otpRepository'
import { OTPController } from '../../../controllers/userControllers/authControllers/otpController'
import { OTPUsecases } from '../../../../application/useCases/user/authUseCases/otpUseCase'
const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const emailService = new EmailService()
const otpService = new OtpService()

const userRepo = new UserRepo(userModel);
const otpRepository = new OTPRepository(Otp);

const signupUsecase = new SignupUseCase(userRepo,bcrypt,emailService,otpService,otpRepository)
const otpUseCase = new OTPUsecases(userRepo,otpRepository,jwtToken,otpService,emailService)

const signupController = new SignupController(signupUsecase);
const otpController = new OTPController(otpUseCase)

router.post('/signup',validateSchema(signupSchema), signupController.register.bind(signupController));
router.post('/verification',otpController.verification.bind(otpController));


export default router