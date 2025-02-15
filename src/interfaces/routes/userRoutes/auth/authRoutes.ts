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
const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const emailService = new EmailService()
const otpService = new OtpService()
const userRepo = new UserRepo(userModel,Otp);
const signupUsecase = new SignupUseCase(userRepo,bcrypt,emailService,otpService)
const signupController = new SignupController(signupUsecase);



router.post('/signup',validateSchema(signupSchema), signupController.register.bind(signupController));


export default router