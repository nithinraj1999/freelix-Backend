import { ISignupUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/ISignupUseCase'
import { IUserRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IUserRepository'
import { Ibcrypt } from '../../../../domain/interfaces/serviceInterfaces/bcryptInterface'
import { IEmailService } from '../../../../domain/interfaces/serviceInterfaces/IEmailService'
import { IOtpService } from '../../../../domain/interfaces/serviceInterfaces/IOtpService'
import { User } from '../../../../domain/entities/user'
import { IOTPRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IOTPRepository'


export class SignupUseCase implements ISignupUseCase {
    private userRepository: IUserRepository
    private bcrypt: Ibcrypt
    private OTPRepository: IOTPRepository
    private emailService: IEmailService
    private otpService: IOtpService
    constructor(
        userRepository: IUserRepository,
        bcrypt: Ibcrypt,
        emailService: IEmailService,
        otpService: IOtpService,
        OTPRepository: IOTPRepository
    ) {
        this.userRepository = userRepository
        this.OTPRepository = OTPRepository
        this.bcrypt = bcrypt
        this.emailService = emailService
        this.otpService = otpService
    }

    async registerUser(data: User): Promise<void> {
        try {
            const existingUser = await this.userRepository.findByEmail(
                data.email
            )
            if (existingUser) {
                throw new Error('User with this email already exists.')
            } else {
                if (data.password) {
                    data.password = await this.bcrypt.hash(data.password)
                }
                const otp = await this.otpService.generateOtp()
                await this.OTPRepository.saveUserOtp(otp, data.email, data)
                await this.emailService.sendEmail(data.email, otp)
                return;
            }
        } catch (error) {
            throw error
        }
    }

    
}
