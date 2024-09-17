import express from 'express'
import { UserController } from '../controllers/userConctroller';
import { RegisterUser } from '../../application/useCases/registerUser';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
const router = express.Router();


// Set up dependencies
const userRepository = new UserRepository();

const registerUser = new RegisterUser(userRepository);
const userController = new UserController(registerUser);

// Define the registration route
router.post('/register', userController.register.bind(userController));


export default router




 