// import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { IUserRepository } from "../../infrastructure/repositories/interface/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import { Ibcrypt } from "../services/interfaces/bcryptInterface";
import { IUserUseCase } from "./interfaces/IUserUseCase";
import { IEmailService } from "../services/interfaces/IEmailService";
import { IOtpService } from "../services/interfaces/IOtpService";
import { jwtInterface } from "../services/interfaces/jwtInterface";
import { IJobPost } from "../../infrastructure/models/jobPostModel";
import { Cloudinary } from "../services/cloudinary";
import { S3Bucket } from "../services/s3bucket";
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
      // const existingUser = await this.userRepository.findByEmail(data.email);
      // if (existingUser) {
      //   throw new Error("User with this email already exists.");
      // } else {
      //   if (data.password) {
      //     data.password = await this.bcrypt.hash(data.password);
      //   }
  
      //   const otp = await this.otpService.generateOtp();
      //   await this.userRepository.saveUserOtp(otp,data.email,data );  // Store user data temporarily in OTP collection
      //   await this.emailService.sendEmail(data.email, otp);
      //   return;
      // }
    } catch (error) {
      throw error;
    }
  }
  

  async verification(otp: string, email: string) {
    try {
      // const findOTP = await this.userRepository.findOTP(otp, email);
      // if (findOTP) {
      //   const savedData = await this.userRepository.save(findOTP.userData);
      //   const token = this.jwtToken.generateAccessToken({ email: email });
      //   return { findOTP, token };
      // }
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
async getAllJobPosts(userID:string,searchQuery:string,page:string){ 
  try{
    const MyjobPosts = await this.userRepository.getAllJobPosts(userID,searchQuery,page);
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

async fetchAllNotifications(userID:string){
  try{
    const notifications = await this.userRepository.fetchAllNotifications(userID)
    return notifications
  }catch(error){
    throw error
  }
}

async getSkills(){
  try{
    const skills = await this.userRepository.getSkills()
    return skills
  }catch(error){
    throw error
  }
}
async storeOrder(bidAmount:string,userId:string,bidId:string,freelancerId:string,jobId:string){
  try{
    
    const order = await this.userRepository.storeOrder(bidAmount,userId,bidId,freelancerId,jobId)
    return order
  }catch(error){
    console.error(error);
    
  }
}


async getAllHirings(clientId:string){
  try{
    
    const allHiring = await this.userRepository.getAllHirings(clientId)
    return allHiring
  }catch(error){
    
    console.error(error);
    throw error
  }
}


async releasePayment(projectId:string,clientId:string,freelancerId:string,total:string){
  try{
    
    const releadPayment = await this.userRepository.releasePayment(projectId,clientId,freelancerId,total)
    return releadPayment
  }catch(error){
    
    console.error(error);
    throw error
  }
}

async submitReview(clientId:string,freelancerId:string,review:string,rating:string){
  try{
    const releadPayment = await this.userRepository.submitReview(clientId,freelancerId,review,rating);
    return releadPayment
  }catch(error){
    
    console.error(error);
    throw error
  }
}

async fetchAllContacts(userId:string){
  try{
    const contacts = await this.userRepository.fetchAllContacts(userId)
    return contacts
  }catch(error){
    console.error(error);
    throw error
  }
}

async fetchChat(userId:string,contactId:string){
  try{
    const chat = await this.userRepository.fetchChat(userId,contactId)
    return chat
  }catch(error){
    throw error
  }
}

async resetPassword(email:string){
  try{
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const resetLink =` http://localhost:5173/reset-password?userId=${user._id}`
    await this.emailService.sendEmailToResetPassword(email,resetLink);
    return { success: true, message: "Password reset link sent" };

  }catch(error){
    throw error
  }
}

async validateAndStorePassword(userId:string,password:string,confirmPassword:string){
  try{
    if(password !== confirmPassword){
      return { success: false, message:"password is not matching"};
    }
    const hashedPassword = await this.bcrypt.hash(password);
    const updatedPassword = await this.userRepository.updatePassword(userId,hashedPassword);
    return { success: true};
  }catch(error){
    throw error
  }
}

async getUserData(userId:string){
  try{
    const userData = await this.userRepository.getUserData(userId);
    return userData
  }catch(error){
    throw error
  }
}

async editData(profilePicture:any,name:string,email:string,userId:string){
  try{
    let image: string | null = null
    if (profilePicture) {
      const {originalname,buffer,mimetype} =profilePicture
      
      
      console.log(originalname);
        const awsS3instance = new S3Bucket()
        image = await awsS3instance.uploadProfilePic(
            originalname,
            buffer,
            mimetype,
          'profile-pics'
        )
    }

    const editedData = await this.userRepository.editData(image,name,email,userId);
    return editedData
  }catch(error){
    throw error
  }
}

async getDeliverable(orderId:string){
  try{
    const deliverable = await this.userRepository.getDeliverable(orderId);
    return deliverable

  }catch(error){
    throw error
  }
}
} 