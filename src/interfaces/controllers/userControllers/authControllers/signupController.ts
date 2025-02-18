import { Request, Response,NextFunction } from 'express'
import { ISignupUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/ISignupUseCase'

export class SignupController {
    
    private signupUseCase: ISignupUseCase

    constructor(signupUseCase: ISignupUseCase) {
        this.signupUseCase = signupUseCase
    }

    async register(req: Request, res: Response,next:NextFunction) {
        try {
            const { password, confirmPassword } = req.body
            if (password !== confirmPassword) {
                res.json({ message: 'password is not matching' })
            } else {
                const user = await this.signupUseCase.registerUser(req.body)
                res.status(201).json({
                    success: true,
                    userID: user,
                    email: req.body.email,
                    message:
                        'User registration successful. Please verify the OTP sent to your email.',
                })
            }
        } catch (err) {
            res.json({ success: false, message: 'Email already exist' })
        }
    }
} 
