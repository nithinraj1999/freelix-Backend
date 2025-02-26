import express from 'express'
import { JobPostController } from '../../controllers/userControllers/jobPostController/jobPostController';
import userAuthMiddleware from '../../middleware/auth';
import validateSchema from '../../middleware/validator';
import { JobPostRepository } from '../../../infrastructure/repositories/userRepositories/jobPostRepository';
import jobPostModel from '../../../infrastructure/models/jobPostModel';
import { JobPostUsecase } from '../../../application/useCases/user/jobPostUseCase/jobPostUseCase';
import { userSocketMap } from '../../../application/services/socket';
import { FreelancerRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerRepository';
import userModel from '../../../infrastructure/models/userModel';
import { NotificationService } from '../../../application/services/notificationService';
import { upload } from '../../../application/services/multer';
import { jobCreationSchema } from '../../../domain/validation/validation';
import { editJobPostSchema } from '../../../domain/validation/validation';


const jobRepository = new JobPostRepository(jobPostModel)
const freelancerRepository = new FreelancerRepository(userModel)
const jobPostUseCases = new JobPostUsecase(jobRepository,freelancerRepository)
const notificationService = new NotificationService()
const jobPostController = new JobPostController(jobPostUseCases,userSocketMap,notificationService)

const router = express.Router();


router.post('/create-job-post',userAuthMiddleware,upload.single('file'),validateSchema(jobCreationSchema) ,jobPostController.createJobPost.bind(jobPostController));
router.post('/my-job-posts',userAuthMiddleware,jobPostController.getAllJobPosts.bind(jobPostController));
router.put('/delete-post',userAuthMiddleware,jobPostController.deletePost.bind(jobPostController));
router.post('/edit-post',validateSchema(editJobPostSchema),userAuthMiddleware,jobPostController.editPost.bind(jobPostController));
router.post('/my-job-details',userAuthMiddleware,jobPostController.jobPostdetails.bind(jobPostController));


export default router 
