// import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { IUserRepository } from "./interface/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import userModel from "../models/userModel";
import Otp from "../models/otpModel";
import jobPostModel from "../models/jobPostModel";
import { IJobPost } from "../models/jobPostModel";
export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await userModel.findOne({ email:email,isAdmin:false,isBlock:false });
        if (!user) return null;
        return user
    }

    async save(user: User): Promise<User> {
        const newUser = userModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            role: user.role,
            profilePicture: user.profilePicture,
        });

        
        return newUser
    }

    async saveUserOtp(userId:string,otp:string,email:string):Promise<any>{
        const newOtp = new Otp({
            userID:userId,
            otp:otp,
            email:email
        })
       const otpDoc = await newOtp.save()
       return otpDoc
    }
    
    async findOTP(otp: string, userID: string): Promise<boolean> {
        const matchOTP = await Otp.findOne({ userID: userID, otp: otp });
        if(matchOTP){  
             await userModel.updateOne({_id:userID},{$set:{isVerified:true}})
        }
        return matchOTP !== null;
      }

      async findById(userID:string): Promise<User | null> {
        const user = await userModel.findOne({ _id:userID });
        if (!user) return null;
        return user
      }


      async createJobPost(data: IJobPost, file: string | null) {
        try {
          console.log(data);
          console.log(file);
      
          const { userID, title, category, skills, subCategory, description, experience, fixedPrice, hourlyPrice } = data;
      
          const response = await new jobPostModel({
            userID: userID, 
            title: title,
            category: category,
            subCategory: subCategory,
            skills: skills,
            file: file, // File will either be a string or null
            description: description,
            experience: experience,
            fixedPrice: fixedPrice,
            hourlyPrice: hourlyPrice,
          });
      
          return response;
        } catch (error) {
          console.error("Error creating job post:", error); // Log the error properly
          throw new Error("Failed to create job post"); // Optional: Throw an error if needed
        }
      }
      
} 


 