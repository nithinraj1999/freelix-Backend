import express from 'express'
import { FreelancerBidRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerBidRepository';
import { FreelancerBidUseCase } from '../../../application/useCases/freelancer/freelancerBidUseCase';
import { FreelancerBidController } from '../../controllers/freelancerController/freelancerBidController';

import BidModel from '../../../infrastructure/models/bidModel';
import notificationModel from '../../../infrastructure/models/notification';
import { FreelancerNotificationRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerNotificationRepository';

import freelancerAuth from '../../middleware/freelancerAuth';
import validateSchema from '../../middleware/validator';
import { bidSumissionSchema } from '../../../domain/validation/freelancerValidator';
const router = express.Router();



const freelancerBidRepository = new FreelancerBidRepository(BidModel)
const freelancerNotificationRepository = new FreelancerNotificationRepository(notificationModel)
const freelancerBidUseCase = new FreelancerBidUseCase(freelancerBidRepository,freelancerNotificationRepository)
const freelancerBidController = new FreelancerBidController(freelancerBidUseCase)




router.post('/check-for-existing-bidder',freelancerAuth, freelancerBidController.isExistingBidder.bind(freelancerBidController));
router.post('/submit-bid',freelancerAuth,validateSchema(bidSumissionSchema), freelancerBidController.submitBid.bind(freelancerBidController));
router.post('/all-bids',freelancerAuth, freelancerBidController.getAllBids.bind(freelancerBidController));
router.put('/edit-my-bid',freelancerAuth, freelancerBidController.editMyBid.bind(freelancerBidController));
router.post('/my-bids',freelancerAuth, freelancerBidController.myBids.bind(freelancerBidController));
router.post('/my-bids/details',freelancerAuth, freelancerBidController.myBidDetails.bind(freelancerBidController));
router.post('/withdraw-my-bid',freelancerAuth, freelancerBidController.withdrawBid.bind(freelancerBidController));


export default router