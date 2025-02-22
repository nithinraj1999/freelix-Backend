import express from 'express'
import { UserController } from '../../controllers/userConctroller';
import { UserRepository } from '../../../infrastructure/repositories/userRepository';
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import { EmailService } from '../../../application/services/emailService';
import { UserUseCase } from '../../../application/useCases/userUseCase';
import { OtpService } from '../../../application/services/otpService';
import { JWT } from '../../../application/services/jwt';
import { upload } from '../../../application/services/multer';
import userAuthMiddleware from '../../middleware/auth';
import validateSchema from '../../middleware/validator';
import { signupSchema } from '../../../domain/validation/validation';
import { jobCreationSchema } from '../../../domain/validation/validation';
import { loginSchema } from '../../../domain/validation/validation';
import { editJobPostSchema } from '../../../domain/validation/validation';

const router = express.Router();

// Set up dependencies
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()
const emailService = new EmailService()
const otpService = new OtpService()
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository,bcrypt,emailService,otpService,jwtToken)
const userController = new UserController(userUseCase,jwtToken);

 
// router.post('/signup',validateSchema(signupSchema), userController.register.bind(userController));
// router.post('/verification', userController.verification.bind(userController));
// router.post('/login',validateSchema(loginSchema), userController.loginUser.bind(userController));
// router.post('/resend-otp', userController.resendOTP.bind(userController));

//----------

router.post('/create-job-post',userAuthMiddleware,upload.single('file'),validateSchema(jobCreationSchema) ,userController.createJobPost.bind(userController));
router.post('/my-job-posts',userAuthMiddleware,userController.getAllJobPosts.bind(userController));
router.put('/delete-post',userAuthMiddleware,userController.deletePost.bind(userController));
router.post('/edit-post',validateSchema(editJobPostSchema),userAuthMiddleware,userController.editPost.bind(userController));
router.post('/my-job-details',userAuthMiddleware,userController.jobPostdetails.bind(userController));

//-------
router.post('/all-bids',userAuthMiddleware,userController.fetchAllBids.bind(userController));
router.post('/freelancer-details',userAuthMiddleware, userController.fetchFreelancerDetails.bind(userController));

//----
router.post('/all-notifications',userAuthMiddleware, userController.fetchAllNotifications.bind(userController));
//----
router.get('/get-skills',userAuthMiddleware, userController.getSkills.bind(userController));
router.post('/make-payment',userAuthMiddleware, userController.makePayment.bind(userController));
router.post('/get-all-hiring',userAuthMiddleware,userController.getAllHiring.bind(userController));
router.post('/release-payment',userAuthMiddleware,userController.releasePayment.bind(userController));
//-----
router.post('/submit-review',userAuthMiddleware,userController.submitReview.bind(userController));

//-----
router.post('/get-all-contacts',userController.fetchAllContacts.bind(userController));
router.get('/get-chat',userController.fetchChat.bind(userController));
//-----
router.post('/forget-password',userController.forgetPassword.bind(userController));
router.post('/reset-password',userController.resetPassword.bind(userController));

//-----
router.post('/get-userdata',userAuthMiddleware,userController.getUserData.bind(userController));
router.put('/edit-profile',userAuthMiddleware,upload.single('profilePicture'),userController.editData.bind(userController));

router.post('/download-file',userAuthMiddleware,userController.downloadFile.bind(userController));


export default router 

 
  

 