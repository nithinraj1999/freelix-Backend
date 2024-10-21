import express from 'express'
import { BcryptPasswordHasher } from '../../application/services/bcrypt';
import { FreelancerUseCase } from '../../application/useCases/freelancer/freelancerUseCase';
import { FreelancerRepository } from '../../infrastructure/repositories/freelancerRepository';
import { JWT } from '../../application/services/jwt';
import { FreelancerController } from '../controllers/freelancerController';
import {upload} from '../../application/services/multer'

const router = express.Router();
const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()

const freelancerRepository = new FreelancerRepository();
const freelancerUseCase = new FreelancerUseCase(freelancerRepository,bcrypt,jwtToken)
const freelancerController = new FreelancerController(freelancerUseCase);

router.post('/create-freelancer-account',upload.single('profilePicture'), freelancerController.createFreelancerAccount.bind(freelancerController));
router.post('/switch-to-buying', freelancerController.switchToBuying.bind(freelancerController));
router.post('/switch-to-selling', freelancerController.switchToSelling.bind(freelancerController));
router.get('/job-list', freelancerController.getJobList.bind(freelancerController));
router.post('/profile/edit',upload.single('portfolio'), freelancerController.editprofile.bind(freelancerController));
router.post('/job-detils', freelancerController.getJobDetails.bind(freelancerController));

export default router




 