import express from 'express'
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import { FreelancerUseCase } from '../../../application/useCases/freelancer/freelancerUseCase';
import { FreelancerRepository } from '../../../infrastructure/repositories/freelancerRepository';
import { JWT } from '../../../application/services/jwt';
import { FreelancerController } from '../../controllers/freelancerController';
import {upload} from '../../../application/services/multer'
import validateSchema from '../../middleware/validator';
import { editProfileSchema } from '../../../domain/validation/freelancerValidator';
import { bidSumissionSchema } from '../../../domain/validation/freelancerValidator';
import freelancerAuth from '../../middleware/freelancerAuth';
import { editBidSumissionSchema } from '../../../domain/validation/freelancerValidator';
import { becomeFreelancerSchema } from '../../../domain/validation/freelancerValidator';

const router = express.Router();
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()

const freelancerRepository = new FreelancerRepository();
const freelancerUseCase = new FreelancerUseCase(freelancerRepository,bcrypt,jwtToken)
const freelancerController = new FreelancerController(freelancerUseCase,jwtToken);

router.post('/create-freelancer-account',upload.single('profilePicture'),validateSchema(becomeFreelancerSchema),freelancerController.createFreelancerAccount.bind(freelancerController));
router.post('/switch-to-buying',freelancerAuth, freelancerController.switchToBuying.bind(freelancerController));
router.post('/switch-to-selling', freelancerController.switchToSelling.bind(freelancerController));
router.post('/job-list',freelancerAuth, freelancerController.getJobList.bind(freelancerController));
router.put('/profile/edit',freelancerAuth,upload.single('portfolio'),validateSchema(editProfileSchema),freelancerController.editprofile.bind(freelancerController));
router.post('/job-detils',freelancerAuth, freelancerController.getJobDetails.bind(freelancerController));
router.post('/check-for-existing-bidder',freelancerAuth, freelancerController.isExistingBidder.bind(freelancerController));
router.post('/submit-bid',freelancerAuth,validateSchema(bidSumissionSchema), freelancerController.submitBid.bind(freelancerController));
router.post('/all-bids',freelancerAuth, freelancerController.getAllBids.bind(freelancerController));
router.put('/edit-my-bid',freelancerAuth, freelancerController.editMyBid.bind(freelancerController));
router.post('/my-bids',freelancerAuth, freelancerController.myBids.bind(freelancerController));
router.post('/my-bids/details',freelancerAuth, freelancerController.myBidDetails.bind(freelancerController));
router.post('/withdraw-my-bid',freelancerAuth, freelancerController.withdrawBid.bind(freelancerController));
router.post('/freelancer-details',freelancerAuth, freelancerController.fetchFreelancerDetails.bind(freelancerController));
router.post('/delete-portfolio',freelancerAuth, freelancerController.deletePortfolioImg.bind(freelancerController));
router.post('/my-orders',freelancerAuth,freelancerController.getMyOrders.bind(freelancerController));
router.post('/complete-order',freelancerAuth,upload.single('file'),freelancerController.completeOrder.bind(freelancerController));
router.post('/fetch-reviews',freelancerAuth,freelancerController.fetchReviews.bind(freelancerController));
router.post('/fetch-wallet',freelancerAuth,freelancerController.fetchWallet.bind(freelancerController));
router.post('/get-dashboard-data',freelancerAuth,freelancerController.dashboardData.bind(freelancerController));
router.get('/get-all-skills',freelancerAuth,freelancerController.getSkills.bind(freelancerController));

export default router




 