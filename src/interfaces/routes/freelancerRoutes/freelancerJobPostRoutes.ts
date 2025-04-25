import express from 'express'
import freelancerAuth from '../../middleware/freelancerAuth';
import { FreelancerJobRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerJobRepository';
import { FreelancerJobPostUseCase } from '../../../application/useCases/freelancer/freelancerJobPostUseCase';
import { FreelancerJobPostController } from '../../controllers/freelancerController/freelancerJobPostController';
import jobPostModel from '../../../infrastructure/models/jobPostModel';

const freelancerJobRepository = new FreelancerJobRepository(jobPostModel)
const freelancerJobPostUseCase = new FreelancerJobPostUseCase(freelancerJobRepository)
const freelancerJobPostController = new FreelancerJobPostController(freelancerJobPostUseCase)

const router = express.Router();

router.post('/job-list',freelancerAuth, freelancerJobPostController.getJobList.bind(freelancerJobPostController));
router.post('/job-detils',freelancerAuth, freelancerJobPostController.getJobDetails.bind(freelancerJobPostController));


export default router