import { Ibcrypt } from "../../services/interfaces/bcryptInterface";
import { jwtInterface } from "../../services/interfaces/jwtInterface";
import { Cloudinary } from "../../services/cloudinary";
import { IFreelancer } from "../../../domain/entities/freelancer";
import { IFreelancerRepository } from "../../../infrastructure/repositories/interface/freelancerRepositoryInterface";
import { FreelancerUseCaseInterface } from "../interfaces/IFreelancerUseCase";

export class FreelancerUseCase implements FreelancerUseCaseInterface {
  private freelancerRepository: IFreelancerRepository;
  private bcrypt: Ibcrypt;
  private jwtToken: jwtInterface;
  constructor(
    reelancerRepository: IFreelancerRepository,
    bcrypt: Ibcrypt,
    jwtToken: jwtInterface
  ) {
    this.freelancerRepository = reelancerRepository;
    this.bcrypt = bcrypt;
    this.jwtToken = jwtToken;
  }

  async createFreelancer(data:IFreelancer,profileImagePath:string | null){
    try{

     const response = await this.freelancerRepository.createFreelancerAccount(data, profileImagePath)
     return response
    }catch(error){
      console.error(error);
      
    }
  }

  async findFreelancerById (id:string){
    try{
        const freelancer = await this.freelancerRepository.findFreelancerById(id)
        return freelancer
    }catch(error){
        console.error();
        
    }
  }

  async switchToBuying(userID:string){
    try{
      const freelancer = await this.freelancerRepository.switchToBuying(userID)
      return freelancer
  }catch(error){
      console.error();
      
  }
  }

  async switchToSelling(userID:string){
    try{
      const freelancer = await this.freelancerRepository.switchToSelling(userID)
      return freelancer
  }catch(error){
      console.error();
      
  }
  }

  async getJobList(){
    try{
      const jobList = await this.freelancerRepository.jobList()
      return jobList
    }catch(error){
      console.error(error);
      
    }
  }

  async editProfile(data:any,file: Express.Multer.File |null){
    try{
      let portfolioUrl: string | null = null;
      // If profilePic is provided, upload it to Cloudinary
      if (file) {
        const cloudinaryInstance = new Cloudinary();
        const image = await cloudinaryInstance.uploadProfilePic(file.path);
        portfolioUrl = image.url; // Get the image URL from Cloudinary
      }
      const jobList = await this.freelancerRepository.editProfile(data,portfolioUrl)

      return jobList
    }catch(error){
      console.error(error);
      
    }
  }

  async getJobDetails(jobID:string){
    try{
      const jobDetails = await this.freelancerRepository.jobDetails(jobID)
      return jobDetails
    }catch(error){
      console.error(error);
      throw error
      
    }
  }

  async isBidderAlreadyExist(jobId:string,userId:string){
    try{
      const isExistingBidder = await this.freelancerRepository.isExistingBidder(jobId,userId)
      return isExistingBidder
    }catch(error){
      throw error
    }
  }

  async submitBid(jobId:string,freelancerId:string,bidAmount:string,deliveryDays:string,proposal:string){
    try{
      const bid = await this.freelancerRepository.submitBid(jobId,freelancerId,bidAmount,deliveryDays,proposal)
      return bid
    }catch(error){
      console.error(error);
      throw error
    }
  }
}
 