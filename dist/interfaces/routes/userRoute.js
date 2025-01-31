"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userConctroller_1 = require("../controllers/userConctroller");
const userRepository_1 = require("../../infrastructure/repositories/userRepository");
const bcrypt_1 = require("../../application/services/bcrypt");
const emailService_1 = require("../../application/services/emailService");
const userUseCase_1 = require("../../application/useCases/userUseCase");
const otpService_1 = require("../../application/services/otpService");
const jwt_1 = require("../../application/services/jwt");
const multer_1 = require("../../application/services/multer");
const auth_1 = __importDefault(require("../middleware/auth"));
const validator_1 = __importDefault(require("../middleware/validator"));
const validation_1 = require("../../domain/validation/validation");
const validation_2 = require("../../domain/validation/validation");
const validation_3 = require("../../domain/validation/validation");
const validation_4 = require("../../domain/validation/validation");
const router = express_1.default.Router();
// Set up dependencies
const bcrypt = new bcrypt_1.BcryptPasswordHasher(10);
const jwtToken = new jwt_1.JWT();
const emailService = new emailService_1.EmailService();
const otpService = new otpService_1.OtpService();
const userRepository = new userRepository_1.UserRepository();
const userUseCase = new userUseCase_1.UserUseCase(userRepository, bcrypt, emailService, otpService, jwtToken);
const userController = new userConctroller_1.UserController(userUseCase, jwtToken);
router.post('/signup', (0, validator_1.default)(validation_1.signupSchema), userController.register.bind(userController));
router.post('/verification', userController.verification.bind(userController));
router.post('/login', (0, validator_1.default)(validation_3.loginSchema), userController.loginUser.bind(userController));
router.post('/resend-otp', userController.resendOTP.bind(userController));
router.post('/create-job-post', auth_1.default, multer_1.upload.single('file'), (0, validator_1.default)(validation_2.jobCreationSchema), userController.createJobPost.bind(userController));
router.post('/my-job-posts', auth_1.default, userController.getAllJobPosts.bind(userController));
router.put('/delete-post', auth_1.default, userController.deletePost.bind(userController));
router.post('/edit-post', (0, validator_1.default)(validation_4.editJobPostSchema), auth_1.default, userController.editPost.bind(userController));
router.post('/my-job-details', auth_1.default, userController.jobPostdetails.bind(userController));
router.post('/all-bids', auth_1.default, userController.fetchAllBids.bind(userController));
router.post('/freelancer-details', auth_1.default, userController.fetchFreelancerDetails.bind(userController));
router.post('/all-notifications', auth_1.default, userController.fetchAllNotifications.bind(userController));
router.get('/get-skills', auth_1.default, userController.getSkills.bind(userController));
router.post('/make-payment', auth_1.default, userController.makePayment.bind(userController));
router.post('/get-all-hiring', auth_1.default, userController.getAllHiring.bind(userController));
router.post('/release-payment', auth_1.default, userController.releasePayment.bind(userController));
router.post('/submit-review', auth_1.default, userController.submitReview.bind(userController));
router.post('/get-all-contacts', userController.fetchAllContacts.bind(userController));
router.get('/get-chat', userController.fetchChat.bind(userController));
router.post('/forget-password', userController.forgetPassword.bind(userController));
router.post('/reset-password', userController.resetPassword.bind(userController));
router.post('/get-userdata', auth_1.default, userController.getUserData.bind(userController));
router.put('/edit-profile', auth_1.default, multer_1.upload.single('profilePicture'), userController.editData.bind(userController));
router.post('/download-file', auth_1.default, userController.downloadFile.bind(userController));
exports.default = router;
