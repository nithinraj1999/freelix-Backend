import { IAdminRepository } from "./interface/adminRepositoryInterface";
import { User } from "../../domain/entities/user";
import userModel from "../models/userModel";
import skillsModel from "../models/skillsModel";
export interface editUser {
    name?: string;
    email?: string;
    phone?:number;
    profilePicture?: string;

}


export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await userModel.findOne({ email:email,isAdmin:true });
        if (!user) return null;
        return user
    }

    async getAllClientData(skip:number,limit:number){
        const clients = await userModel.find({isAdmin:false }).skip(skip).limit(limit);        
        if (!clients) return null;
        return clients
    }

    async totalClients(){
      try{
        const totalClients = await userModel.countDocuments({
          role: { $ne: "admin" }
        });
        return totalClients
      }catch(error){
        throw error
      }
    }


    async blockClient(clientID:string){
        try{
            const client = await userModel.updateOne({_id:clientID },{$set:{isBlock:true}});
            return client
        }catch(error){
            console.error(error);
        }
    }

    async unblockClient(clientID:string){
        try{
            const client = await userModel.updateOne({_id:clientID },{$set:{isBlock:false}});
            return client
        }catch(error){
            console.error(error);
        }
    }

    async createUser(data:User,profileUrl:string,hashedPassword:string){
        try{
            const {name,email,phone} = data
            const newUser:User = {
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword, 
                isVerified:true
              };
          
              // Only add profilePicture if profileUrl is not null
              if (profileUrl) {
                newUser["profilePicture"] = profileUrl;
              }
              const response = await userModel.create(newUser);
              return response;
        }catch(error){
            console.error(error);
        }
    }


  async editUser(data:User,profileUrl:string){
    try{
        const {name,email,phone,_id} = data
        
        const user:editUser = {
          };
          if (name) {
            user.name = name;
          }
          if (email) {
            user.email = email;
          }
          if (phone) {
            user.phone = phone;
          }
          
          if (profileUrl) {
            user.profilePicture = profileUrl;
          }
          const response = await userModel.updateOne({_id:_id},{$set:user});
          return response;
    }catch(error){
        console.error(error);
    }
    }


    async getAllFreelancerData(){
        const clients = await userModel.find({isAdmin:false,hasFreelancerAccount:true });
        if (!clients) return null;
        return clients
    }


    // Block a freelancer
  async blockFreelancer(freelancerID: string) {
    try {
      const freelancer = await userModel.updateOne(
        { _id: freelancerID },
        { $set: { isFreelancerBlock: true } }
      );
      return freelancer;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to block freelancer");
    }
  }
  
  // Unblock a freelancer
  async unblockFreelancer(freelancerID: string) {
    try {
      const freelancer = await userModel.updateOne(
        { _id: freelancerID },
        { $set: { isFreelancerBlock: false } }
      );
      return freelancer;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to unblock freelancer");
    }
  }
  
  // Create a freelancer
  async createFreelancer(
    data: User, 
    profileUrl: string | null, 
    hashedPassword: string
  ) {
    try {
      const { name, email, phone, description, skills, education, languages } = data;
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
        
          
      const newFreelancer: User = {
        name,
        email,
        phone,
        password: hashedPassword,
        isVerified: true,
        description,
        skills:skillsArray,       
        hasFreelancerAccount:true,
        languages:languageArray,    // Assuming languages is an array
      };
  
      // Only add profilePicture if profileUrl is not null
      if (profileUrl) {
        newFreelancer["profilePicture"] = profileUrl;
      }
  
      const response = await userModel.create(newFreelancer);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create freelancer");
    }
  }
  
  // Edit a freelancer
  async editFreelancer(data: User, profileUrl: string | null) {
    try {
      const { name, email, phone, description, skills, education, languages, _id } = data;
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
        
      const freelancerUpdate: Partial<User> = {};
  
      // Update only the provided fields
      if (name) {
        freelancerUpdate.name = name;
      }
      if (email) {
        freelancerUpdate.email = email;
      }
      if (phone) {
        freelancerUpdate.phone = phone;
      }
      if (description) {
        freelancerUpdate.description = description;
      }
      if (skills) {
        freelancerUpdate.skills = skillsArray;
      }
    
      if (languages) {
        freelancerUpdate.languages = languageArray;
      }
      if (profileUrl) {
        freelancerUpdate.profilePicture = profileUrl;
      }
  
      const response = await userModel.updateOne(
        { _id: _id },
        { $set: freelancerUpdate }
      );
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to edit freelancer");
    }
  }
  
async addSkills(skill:string,description:string){
  try{
    const skills = await skillsModel.create({
      skill:skill,
      description:description
    })
    return skills
  }catch(error){
    throw error
  }
}



}


 