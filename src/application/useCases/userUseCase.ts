import { IUserRepository } from "../../domain/interfaces/user/repositoryInterfaces/IUserRepository";
import { Ibcrypt } from "../services/interfaces/bcryptInterface";
import { IEmailService } from "../services/interfaces/IEmailService";
import { IOtpService } from "../services/interfaces/IOtpService";
import { jwtInterface } from "../services/interfaces/jwtInterface";
import { S3Bucket } from "../services/s3bucket";
import { IUserUseCase } from "../../domain/interfaces/user/useCaseInterfaces/IUserUseCase";
export class UserUseCase implements IUserUseCase  {
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



async getAllFreelancers(){
  try {
    const response = await this.userRepository.getAllFreelancers();
    return response;
  } catch (error) {
    console.error("Error in use case:", error);
    throw error;
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

} 