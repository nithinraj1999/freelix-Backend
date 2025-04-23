import express from 'express'
import { AuthAdminRepository } from '../../../infrastructure/repositories/adminRepository/authAdminRepository';
import { AdminAuthUseCase } from '../../../application/useCases/admin/adminAuthUseCase';
import { AdminAuthController } from '../../controllers/adminController/authController';
import { BcryptPasswordHasher } from '../../../application/services/bcrypt';
import { JWT } from '../../../application/services/jwt';


const router = express.Router();

const bcrypt = new BcryptPasswordHasher(10);
const jwtToken = new JWT()

const authAdminRepository = new AuthAdminRepository()
const adminAuthUseCase = new AdminAuthUseCase(authAdminRepository,bcrypt)
const adminAuthController = new AdminAuthController(adminAuthUseCase,jwtToken)


router.post('/login', adminAuthController.loginAdmin.bind(adminAuthController) );
router.get('/refresh-token', adminAuthController.refreshToken.bind(adminAuthController));


export default router