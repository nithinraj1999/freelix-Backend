import express from 'express'
import freelancerAuth from '../../middleware/freelancerAuth';
import { FreelancerWalletRepository } from '../../../infrastructure/repositories/freelancerRepositories/freeelancerWalletRepository';
import { FreelancerWalletUseCase } from '../../../application/useCases/freelancer/freelancerWalletUseCase';
import { FreelancerWalletController } from '../../controllers/freelancerController/freelancerWalletController';

import WalletModel from '../../../infrastructure/models/wallet';


const freelancerWalletRepository =new FreelancerWalletRepository(WalletModel)
const freelancerWalletUseCase = new FreelancerWalletUseCase(freelancerWalletRepository)
const freelancerWalletController = new FreelancerWalletController(freelancerWalletUseCase)
const router = express.Router();

router.post('/fetch-wallet',freelancerAuth,freelancerWalletController.fetchWallet.bind(freelancerWalletController));

export default router