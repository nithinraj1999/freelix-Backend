import express from 'express'
import { BidController } from '../../controllers/userControllers/bidController/bidController';
import { BidRepository } from '../../../infrastructure/repositories/userRepositories/bidRepository';
import { BidUseCase } from '../../../application/useCases/user/bidUseCase/bidUseCase';
import BidModel from '../../../infrastructure/models/bidModel';
import userAuthMiddleware from '../../middleware/auth';


const bidRepository = new BidRepository(BidModel)
const bidUseCase = new BidUseCase(bidRepository)
const bidController = new BidController(bidUseCase)

const router = express.Router();


router.post('/all-bids',userAuthMiddleware,bidController.fetchAllBids.bind(bidController));


export default router 
