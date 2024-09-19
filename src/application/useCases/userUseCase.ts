import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import { Ibcrypt } from "../services/interfaces/bcryptInterface";
import { IUserUseCase } from "./interfaces/IUserUseCase";
import { IEmailService } from "../services/interfaces/IEmailService";
import { OtpService } from "../services/otpService";
import { IOtpService } from "../services/interfaces/IOtpService";


export class UserUseCase implements IUserUseCase {
  private userRepository: IUserRepository;
  private bcrypt: Ibcrypt;
  private emailService : IEmailService; 
  private otpService:IOtpService;
  constructor(userRepository: IUserRepository, bcrypt: Ibcrypt,emailService:IEmailService,otpService:IOtpService) {
    this.userRepository = userRepository;
    this.bcrypt = bcrypt;
    this.emailService = emailService;
    this.otpService = otpService
  }

  async registerUser(data: User): Promise<void> {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error("User with this email already exists.");
        
      } else {
        data.password = await this.bcrypt.hash(data.password);
        const savedData = await this.userRepository.save(data);
        console.log(savedData);
        
        await this.emailService.sendEmail("nithinjr1999@gmail.com","yourOTP")
        const otp = await this.otpService.generateOtp()
        console.log(savedData._id);
        
        await this.userRepository.saveUserOtp(savedData._id,otp)
        
      }
    } catch (error) {
      throw error;
    } 
  }
}
 