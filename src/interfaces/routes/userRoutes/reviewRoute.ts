import express from 'express'
import userAuthMiddleware from '../../middleware/auth';
import { ReviewRepository } from '../../../infrastructure/repositories/userRepositories/reviewRepository';
import { ReviewUseCase } from '../../../application/useCases/user/reviewUseCase/reviewUseCase';
import { ReviewController } from '../../controllers/userControllers/reviewController/reviewController';
import ReviewModel from '../../../infrastructure/models/reviewModel';

const reviewRepository = new ReviewRepository(ReviewModel)
const reviewUseCase = new ReviewUseCase(reviewRepository)
const reviewController = new ReviewController(reviewUseCase)

const router = express.Router();

router.post('/submit-review',userAuthMiddleware,reviewController.submitReview.bind(reviewController));

export default router