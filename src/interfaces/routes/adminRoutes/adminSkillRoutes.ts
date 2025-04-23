import express from 'express'
import authMiddleware from '../../middleware/userAuth';
import { SkillsAdminRepository } from '../../../infrastructure/repositories/adminRepository/skillsAdminRepository';
import { AdminSkillUseCase } from '../../../application/useCases/admin/adminSkillUseCase';
import { SkillController } from '../../controllers/adminController/skillController';


const router = express.Router();

const skillsAdminRepository = new SkillsAdminRepository()
const adminSkillUseCase = new AdminSkillUseCase(skillsAdminRepository)
const adminSkillController = new SkillController(adminSkillUseCase)


router.get('/get-all-skills',authMiddleware,adminSkillController.getAllSkills.bind(adminSkillController));
router.post('/add-skills',authMiddleware, adminSkillController.addSkills.bind(adminSkillController));

export default router