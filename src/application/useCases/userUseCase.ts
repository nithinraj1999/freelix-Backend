// import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { IUserRepository } from "../../infrastructure/repositories/interface/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import { Ibcrypt } from "../services/interfaces/bcryptInterface";
import { IUserUseCase } from "./interfaces/IUserUseCase";
import { IEmailService } from "../services/interfaces/IEmailService";
import { IOtpService } from "../services/interfaces/IOtpService";
import { jwtInterface } from "../services/interfaces/jwtInterface";
import { IJobPost } from "../../infrastructure/models/jobPostModel";

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
        if (data.password) {
          data.password = await this.bcrypt.hash(data.password);
        }
        
        const otp = await this.otpService.generateOtp();
        await this.userRepository.saveUserOtp(otp,data.email,data );  // Store user data temporarily in OTP collection
        await this.emailService.sendEmail(data.email, otp);
        return;
      }
    } catch (error) {
      throw error;
    }
  }
  

  async verification(otp: string, email: string) {
    try {
      const findOTP = await this.userRepository.findOTP(otp, email);
      if (findOTP) {
        const savedData = await this.userRepository.save(findOTP.userData);
        const token = this.jwtToken.generateAccessToken({ email: email });
        return { findOTP, token };
      }
    } catch (error) { 
      console.error(error);
      throw error
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

  async resendOTP(email: string) {
    try {
      const otp = await this.otpService.generateOtp();
      
        const response = await this.userRepository.updateUserOtp(otp,email);
        await this.emailService.sendEmail(response.email, otp);
  
    } catch (error) {
      throw error;
    }
  }

async createJobPost(data: IJobPost, file: string | null) {
  try {
    const response = await this.userRepository.createJobPost(data, file);
    return response;
  } catch (error) {
    console.error("Error in use case:", error);
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

async getAllFreelancers(){
  try {
    const response = await this.userRepository.getAllFreelancers();
    return response;
  } catch (error) {
    console.error("Error in use case:", error);
    // Rethrow the error to be handled by the controller
    throw error;
  }
}
async getAllJobPosts(userID:string){ 
  try{
    const MyjobPosts = await this.userRepository.getAllJobPosts(userID);
    return MyjobPosts;
  }catch(error){
    console.error(error);
    
  }
}

async deleteJobPost(jobId:string){
  try{
    const deletedJobPost = await this.userRepository.deleteJobPost(jobId);
    return deletedJobPost;
  }catch(error){
    console.error(error);
    
  }
}

async editPost(data:any){
  try{
    const editedPost = await this.userRepository.editPost(data);
    return editedPost;
  }catch(error){
    console.error(error);
    
  }
}

async  jobDetails(jobId:string){
  try{
    const jobDetails = await this.userRepository.jobDetails(jobId);
    return jobDetails
  }catch(error){
    console.error(error);
    
  }
}

async fetchAllBids(jobId:string){
  try{
    const bids = await this.userRepository.allBids(jobId);
    return bids
  }catch(error){
    console.error(error);
    
  }
}

async fetchFreelancerDetails(freelancerId:string){
  try{
    const details = await this.userRepository.getFreelancerDetails(freelancerId)
    return details
  }catch(error){
    throw error
  }
}
}