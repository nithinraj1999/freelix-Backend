"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupController_1 = require("../../controllers/userControllers/authControllers/signupController");
const userRepo_1 = require("../../../infrastructure/repositories/userRepositories/userRepo");
const bcrypt_1 = require("../../../application/services/bcrypt");
const emailService_1 = require("../../../application/services/emailService");
const otpService_1 = require("../../../application/services/otpService");
const jwt_1 = require("../../../application/services/jwt");
const validator_1 = __importDefault(require("../../middleware/validator"));
const validation_1 = require("../../../domain/validation/validation");
const signupUseCase_1 = require("../../../application/useCases/user/authUseCases/signupUseCase");
const userModel_1 = __importDefault(require("../../../infrastructure/models/userModel"));
const otpModel_1 = __importDefault(require("../../../infrastructure/models/otpModel"));
const otpRepository_1 = require("../../../infrastructure/repositories/userRepositories/otpRepository");
const otpController_1 = require("../../controllers/userControllers/authControllers/otpController");
const otpUseCase_1 = require("../../../application/useCases/user/authUseCases/otpUseCase");
const validation_2 = require("../../../domain/validation/validation");
const emailLoginUseCase_1 = require("../../../application/useCases/user/authUseCases/emailLoginUseCase");
const loginController_1 = require("../../controllers/userControllers/authControllers/loginController");
const router = express_1.default.Router();
//========= services
const bcrypt = new bcrypt_1.BcryptPasswordHasher(10);
const jwtToken = new jwt_1.JWT();
const emailService = new emailService_1.EmailService();
const otpService = new otpService_1.OtpService();
//========= repositories
const userRepo = new userRepo_1.UserRepo(userModel_1.default);
const otpRepository = new otpRepository_1.OTPRepository(otpModel_1.default);
//========= use cases
const signupUsecase = new signupUseCase_1.SignupUseCase(userRepo, bcrypt, emailService, otpService, otpRepository);
const otpUseCase = new otpUseCase_1.OTPUsecases(userRepo, otpRepository, jwtToken, otpService, emailService);
const emailLoginUseCase = new emailLoginUseCase_1.EmailLoginUseCase(userRepo, bcrypt);
//========= controllers
const loginController = new loginController_1.LoginController(emailLoginUseCase, jwtToken);
const signupController = new signupController_1.SignupController(signupUsecase);
const otpController = new otpController_1.OTPController(otpUseCase);
//========= routes
router.post('/signup', (0, validator_1.default)(validation_1.signupSchema), signupController.register.bind(signupController));
router.post('/verification', otpController.verification.bind(otpController));
router.post('/login', (0, validator_1.default)(validation_2.loginSchema), loginController.loginUser.bind(loginController));
exports.default = router;
