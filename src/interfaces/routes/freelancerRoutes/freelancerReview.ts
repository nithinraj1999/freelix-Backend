import express from 'express'
import { FreelancerReviewRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerReviewRepository';
import { FreelancerReviewUseCase } from '../../../application/useCases/freelancer/freelancerReviewUseCase';
import { FreelancerReviewController } from '../../controllers/freelancerController/freelancerReviewController';
import ReviewModel from '../../../infrastructure/models/reviewModel';
import freelancerAuth from '../../middleware/freelancerAuth';

const freelancerReviewRepository =new FreelancerReviewRepository(ReviewModel)
const freelancerReviewUseCase =new FreelancerReviewUseCase(freelancerReviewRepository)
const freelancerReviewController = new FreelancerReviewController(freelancerReviewUseCase)
const router = express.Router();


router.post('/fetch-reviews',freelancerAuth,freelancerReviewController.fetchReviews.bind(freelancerReviewController));
export default router