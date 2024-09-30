import { IFreelancer } from "../../domain/entities/freelancer";
import freelancerModel from "../models/freelancerModel";
import { IFreelancerRepository } from "./interface/freelancerRepositoryInterface";
import userModel from "../models/userModel";

export class FreelancerRepository implements IFreelancerRepository {
  async createFreelancerAccount(
    data: IFreelancer,
    profileImagePath: string | null
  ) {
    try {
      const { name, description, skills, languages, education, userID } = data;
      const skillsArray: string[] = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' 
        ? JSON.parse(skills) // Use JSON.parse to convert the string into an array
        : []; // Default to an empty array if skills is undefined or not a string

        const languageArray: string[] = Array.isArray(languages) 
      ? languages 
      : typeof languages === 'string' 
        ? JSON.parse(languages) // Use JSON.parse to convert the string into an array
        : []; // Default to an empty array if skills is undefined or not a string
        
      const response = await userModel.updateOne(
        { _id: userID },
        {
          $set: {
            description: description,
            languages: languageArray,
            skills: skillsArray,
            role:'freelancer',
            hasFreelancerAccount:true
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async findFreelancerById (id:string){
    try{
        const freelancer = await userModel.findOne({_id:id})
      return  freelancer
    }catch(error){
        console.error();
        
    }
  }

  async switchToBuying(userID:string){
    try{
      const freelancer = await userModel.updateOne({_id:userID},{$set:{role:'client'}})
      return  freelancer
  }catch(error){
      console.error();
      
  }
  }

  async switchToSelling(userID:string){
    try{
      const freelancer = await userModel.updateOne({_id:userID},{$set:{role:'freelancer'}})
      return  freelancer
  }catch(error){
      console.error();
      
  }
  }
}
