import { IUserRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IUserRepository'
import { IOTPRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IOTPRepository'
import { IJwt } from '../../../../domain/interfaces/serviceInterfaces/jwtInterface';
import { IOTPUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IOTPUseCase';
import { IOtpService } from '../../../../domain/interfaces/serviceInterfaces/IOtpService';
import { IEmailService } from '../../../../domain/interfaces/serviceInterfaces/IEmailService';

export class OTPUsecases implements IOTPUseCase{

    private userRepository: IUserRepository;
    private OTPRepository:IOTPRepository;
    private jwt :IJwt;
    private otpService:IOtpService;
    private emailService:IEmailService;

    constructor(
        userRepository: IUserRepository,
        OTPRepository: IOTPRepository,
        jwt :IJwt,
        otpService:IOtpService,
        emailService:IEmailService
    ) {
        this.userRepository = userRepository
        this.OTPRepository = OTPRepository
        this.jwt =jwt
        this.otpService = otpService
        this.emailService = emailService
    }
    
    async verification(otp: string, email: string) {
        try {
            const findOTP = await this.OTPRepository.findOTP(otp, email)
            if (findOTP) {
                const savedData = await this.userRepository.save(
                    findOTP.userData
                )
                const token = this.jwt.generateAccessToken({
                    email: email,
                })
                return { findOTP, token }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async resendOTP(email: string) {
        try {
          const otp = await this.otpService.generateOtp();
          
            const response = await this.OTPRepository.updateUserOtp(otp,email);
            await this.emailService.sendEmail(response.email, otp);
        } catch (error) {
          throw error;
        }
      }
    
}
