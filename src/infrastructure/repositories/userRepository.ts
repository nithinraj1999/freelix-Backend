// import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { IUserRepository } from "./interface/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import userModel from "../models/userModel";
import Otp from "../models/otpModel";
import jobPostModel from "../models/jobPostModel";
import { IJobPost } from "../models/jobPostModel";
import BidModel from "../models/bidModel";
import notificationModel from "../models/notification";
import skillsModel from "../models/skillsModel";
export class UserRepository implements IUserRepository {
  
  async checkEmailExist(email: string): Promise<User | null> {
    try{
      const user = await userModel.findOne({ email:email,isAdmin:false,isBlock:false });
      if (!user) return null;
      return user
    }catch(error){
      throw error
    }
  }
    async findByEmail(email: string): Promise<User | null> {
      try{
        const user = await userModel.findOne({ email:email,isAdmin:false,isBlock:false,isVerified:true });
        if (!user) return null;
        return user
      }catch(error){
        throw error
      }
    }

    async save(user: User): Promise<User> {
        const newUser = userModel.create({ 
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            isVerified:true,
        });
        return newUser
    }

    async saveUserOtp(otp:string,email:string,userDta:any):Promise<any>{
      const otpExpirationTime = 120000;
        const newOtp = new Otp({
            otp:otp,
            email:email,
            userData: {
              name: userDta.name,
              email: userDta.email,
              password: userDta.password,
              phone: userDta.phone,
            },
            createdAt: Date.now(),
        })
       const otpDoc = await newOtp.save()
       setTimeout(async () => {
        await Otp.updateOne({ email: email }, { $set: { otp: null } });
      }, otpExpirationTime);
       return otpDoc
    } 

    async updateUserOtp( otp:string,email:string):Promise<any>{
      const newOtp = await Otp.findOneAndUpdate({email:email},{$set:{otp:otp}})
      return newOtp
  }
  
    
      async findOTP(otp: string, email: string) {
        const matchOTP = await Otp.findOne({ email: email, otp: otp });
        return matchOTP 
      }

      async findById(userID:string): Promise<User | null> {
        try{
          const user = await userModel.findOne({ _id:userID });
          if (!user) return null;
          return user
        }
        catch(error){
        throw error
        }
      }


      async createJobPost(data: IJobPost, file: string | null) {
        try {
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
      
          return response;
        } catch (error) {
          console.error("Error creating job post:", error);
          // Rethrow the error so that it can be handled by the use case or controller
          throw new Error("Failed to create job post");
        }
      }

      async getAllFreelancers(){
        try{
          const freelancer = await userModel.find({hasFreelancerAccount:true},{_id:1} ).lean();
          return freelancer
        }catch(error){
          console.error(error);
          throw error
        }
      }

      async getAllJobPosts(userID:string){
        try{
          const MyPost = await jobPostModel.find({userID:userID,isDelete:false})
          return MyPost
        }catch(error){
          console.error(error);
          throw error
        }
      }

      async deleteJobPost(jobId:string){
        try {      
          const result = await jobPostModel.findByIdAndUpdate({ _id: jobId },{$set:{isDelete:true}});  // Delete job by ID
          return result
        } catch (error) {
          console.error(`Error deleting job with ID ${jobId}:`, error);
        }
      
      }
      
      async editPost(data: any) {
        try {
          const { _id, title, description, skills, paymentType, hourlyPrice ,fixedPrice} = data;
      
        
          // Create an object containing the fields to update
          const updateData: Partial<{
            title: string;
            description: string;
            skills: string[];
            paymentType: string;
            hourlyPrice?: {
              from?: number;
              to?: number;
            }|null;
            fixedPrice?: number|null;
          }> = {
            title,
            description,
            skills,
            paymentType,
          };
      
          // Handle payment type: hourly or fixed
          if (paymentType === "hourly" ) {
            updateData.hourlyPrice = {
              from: hourlyPrice.from,
              to: hourlyPrice.to,
            };
            // Set fixedPrice to undefined to remove it
            updateData.fixedPrice = null;
          } else if (paymentType === "fixed") {
            updateData.fixedPrice = fixedPrice;
            // Set hourlyPrice to undefined to remove it
            updateData.hourlyPrice = null;
          }
      

          const result = await jobPostModel.findByIdAndUpdate(_id, updateData, { new: true });
      
          if (result) {
            return result; // Optionally return the updated post
          } else {
            console.log("Job post not found.");
            return null; // Handle the case where the job post doesn't exist
          }
        } catch (error) {
          console.error(`Error updating job post with ID ${data._id}:`, error);
          throw error; // Optionally rethrow the error to be handled by the caller
        }
      }


      async jobDetails(jobId:string){
        try{
          const jobDetails = await jobPostModel.findOne({_id:jobId})
          return jobDetails
        }catch(error){
          console.error(error);
          throw error
        }
      }

      async allBids(jobId:string){
        try{
        const allBids = await BidModel.find({jobId:jobId,status:{$ne:"Withdrawn"}}).populate("freelancerId").sort({ createdAt: -1 })
        return allBids
        }catch(error){
          console.error(error);
          throw error

        } 
      }


      async getFreelancerDetails(freelancerId:string){
        try{
          const details = await userModel.findOne({_id:freelancerId})
          return details
        }catch(error){
          throw error
        }
      }

      async fetchAllNotifications(userID:string){
        try{
          const notifications = await notificationModel.find({userID:userID})
          return notifications
        }catch(error){
          throw error
        }
      }

      async getSkills(){
        try{
          const skills = await skillsModel.find({},{skill:1,_id:0})
          return skills
        }catch(error){
          throw error
        }
      }

    }      