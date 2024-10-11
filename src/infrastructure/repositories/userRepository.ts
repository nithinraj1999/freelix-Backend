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
      
          const { userID, title, category, skills, subCategory, description, experience, fixedPrice,paymentType, hourlyPrice } = data;
          console.log(skills);
          const skillsArray: string[] = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? JSON.parse(skills) // Use JSON.parse to convert the string into an array
        : []; // Default to an empty array if skills is undefined or not a string

          const response = await jobPostModel.create({
            userID: userID,
            title: title,
            category: category,
            subCategory: subCategory,
            skills: skillsArray,
            file: file, // File will either be a string or null
            description: description,
            experience: experience,
            paymentType:paymentType,
            fixedPrice: fixedPrice,  
            hourlyPrice: {
              from: hourlyPrice?.from,
              to: hourlyPrice?.to,
            },
          });
      
          console.log("Job post created:", response);
          return response;
        } catch (error) {
          console.error("Error creating job post:", error);
          // Rethrow the error so that it can be handled by the use case or controller
          throw new Error("Failed to create job post");
        }
      }
      
} 


 