// import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { IUserRepository } from "../../infrastructure/repositories/interface/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import { Ibcrypt } from "../services/interfaces/bcryptInterface";
import { IUserUseCase } from "./interfaces/IUserUseCase";
import { IEmailService } from "../services/interfaces/IEmailService";
import { IOtpService } from "../services/interfaces/IOtpService";
import { jwtInterface } from "../services/interfaces/jwtInterface";

export class UserUseCase implements IUserUseCase {
  private userRepository: IUserRepository;
  private bcrypt: Ibcrypt;
  private emailService: IEmailService;
  private otpService: IOtpService;
  private jwtToken: jwtInterface;
  constructor(
    userRepository: IUserRepository,
    bcrypt: Ibcrypt,
    emailService: IEmailService,
    otpService: IOtpService, 
    jwtToken: jwtInterface
  ) {
    this.userRepository = userRepository;
    this.bcrypt = bcrypt;
    this.emailService = emailService;
    this.otpService = otpService;
    this.jwtToken = jwtToken;
  }

  async registerUser(data: User): Promise<void> {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error("User with this email already exists.");
      } else {
        if(data.password){
          data.password = await this.bcrypt.hash(data.password);
        }
       
        const savedData = await this.userRepository.save(data);
        const email = data.email;
        const otp = await this.otpService.generateOtp();

        await this.userRepository.saveUserOtp(savedData._id, otp, email);
        await this.emailService.sendEmail(email, otp);

        return savedData._id;
      }
    } catch (error) {
      throw error;
    }
  }

  async verification(otp: string, userID: string) {
    try {
      const findOTP = await this.userRepository.findOTP(otp, userID);
      if (findOTP) {
        const token = this.jwtToken.generateAccessToken({ userID: userID });
        return { findOTP, token };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async authenticateUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        if(user.password){
          const hashedPassword = user.password;
          const isPasswordValid = await this.bcrypt.compare(
            password,
            hashedPassword
          );
          if (isPasswordValid) {
            return user;
          }
        }
       
      }
    } catch (error) {
      console.error(error);
    }
  }

  async resendOTP(userID: string) {
    try {
      const otp = await this.otpService.generateOtp();
      const user = await this.userRepository.findById(userID);
      if (user) {
        const email = user.email;
        const response = await this.userRepository.saveUserOtp(
          userID,
          otp,
          email
        );
        await this.emailService.sendEmail(response.email, otp);
      }
    } catch (error) {
      throw error;
    }
  }
}
