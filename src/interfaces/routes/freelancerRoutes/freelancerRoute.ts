import express from 'express'
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import { FreelancerUseCase } from '../../../application/useCases/freelancer/freelancerUseCase';
import { FreelancerRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerRepository';
import { JWT } from '../../../application/services/jwt';
import {upload} from '../../../application/services/multer'
import validateSchema from '../../middleware/validator';
import { editProfileSchema } from '../../../domain/validation/freelancerValidator';
import freelancerAuth from '../../middleware/freelancerAuth';
import { becomeFreelancerSchema } from '../../../domain/validation/freelancerValidator';
import { FreelancerController } from '../../controllers/freelancerController/freelancerAccountController';
import userModel from '../../../infrastructure/models/userModel';
import { FreelancerSkillRepository } from '../../../infrastructure/repositories/freelancerRepositories/freelancerSkillRepository';
import skillsModel from '../../../infrastructure/models/skillsModel';
const router = express.Router();
const jwtToken = new JWT()

const freelancerRepository = new FreelancerRepository(userModel);
const freelancerSkillRepository = new FreelancerSkillRepository(skillsModel);

const freelancerUseCase = new FreelancerUseCase(freelancerRepository,freelancerSkillRepository)
const freelancerController = new FreelancerController(freelancerUseCase,jwtToken);

router.post('/create-freelancer-account',upload.single('profilePicture'),validateSchema(becomeFreelancerSchema),freelancerController.createFreelancerAccount.bind(freelancerController));
router.post('/switch-to-buying',freelancerAuth, freelancerController.switchToBuying.bind(freelancerController));
router.post('/switch-to-selling', freelancerController.switchToSelling.bind(freelancerController));
router.put('/profile/edit',freelancerAuth,upload.single('portfolio'),validateSchema(editProfileSchema),freelancerController.editprofile.bind(freelancerController));
router.post('/freelancer-details',freelancerAuth, freelancerController.fetchFreelancerDetails.bind(freelancerController));
router.post('/delete-portfolio',freelancerAuth, freelancerController.deletePortfolioImg.bind(freelancerController));
router.get('/get-all-skills',freelancerAuth,freelancerController.getSkills.bind(freelancerController));
router.post('/get-dashboard-data',freelancerAuth,freelancerController.dashboardData.bind(freelancerController));


export default router




 