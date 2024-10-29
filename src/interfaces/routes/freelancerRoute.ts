import express from 'express'
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { FreelancerUseCase } from '../../application/useCases/freelancer/freelancerUseCase';
import { FreelancerRepository } from '../../infrastructure/repositories/freelancerRepository';
import { JWT } from '../../application/services/jwt';
import { FreelancerController } from '../controllers/freelancerController';
import {upload} from '../../application/services/multer'
import validateSchema from '../middleware/validator';
import { editProfileSchema } from '../../domain/validation/freelancerValidator';
import { bidSumissionSchema } from '../../domain/validation/freelancerValidator';
import freelancerAuth from '../middleware/freelancerAuth';
const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()

const freelancerRepository = new FreelancerRepository();
const freelancerUseCase = new FreelancerUseCase(freelancerRepository,bcrypt,jwtToken)
const freelancerController = new FreelancerController(freelancerUseCase,jwtToken);

router.post('/create-freelancer-account',upload.single('profilePicture'), freelancerController.createFreelancerAccount.bind(freelancerController));
router.post('/switch-to-buying',freelancerAuth, freelancerController.switchToBuying.bind(freelancerController));
router.post('/switch-to-selling', freelancerController.switchToSelling.bind(freelancerController));
router.get('/job-list',freelancerAuth, freelancerController.getJobList.bind(freelancerController));
router.post('/profile/edit',freelancerAuth,upload.single('portfolio'),validateSchema(editProfileSchema), freelancerController.editprofile.bind(freelancerController));
router.post('/job-detils',freelancerAuth, freelancerController.getJobDetails.bind(freelancerController));
router.post('/check-for-existing-bidder',freelancerAuth, freelancerController.isExistingBidder.bind(freelancerController));
router.post('/submit-bid',freelancerAuth,validateSchema(bidSumissionSchema), freelancerController.submitBid.bind(freelancerController));
router.post('/all-bids', freelancerController.getAllBids.bind(freelancerController));

export default router




 