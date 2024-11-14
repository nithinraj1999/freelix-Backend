import { IFreelancer } from "../../domain/entities/freelancer";
import { IFreelancerRepository } from "./interface/freelancerRepositoryInterface";
import userModel from "../models/userModel";
import jobPostModel from "../models/jobPostModel";
import { Cloudinary } from "../../application/services/cloudinary";
import BidModel from "../models/bidModel";
import { IBid } from "../models/interface/IBidModel";
import notificationModel from "../models/notification";
import OrderModel from "../models/orderModel";
export class FreelancerRepository implements IFreelancerRepository {
  async createFreelancerAccount(
    data: IFreelancer,
    profileImagePath: string | null
  ) {
    try {
      const { name, description, skills, languages, education, userID } = data;
      let profileUrl: string | null = null;

      // If profilePic is provided, upload it to Cloudinary
      if (profileImagePath) {
        const cloudinaryInstance = new Cloudinary();
        const image = await cloudinaryInstance.uploadProfilePic(
          profileImagePath
        );
        profileUrl = image.url; // Get the image URL from Cloudinary
      }
      const skillsArray: string[] = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? JSON.parse(skills) // Use JSON.parse to convert the string into an array
        : []; // Default to an empty array if skills is undefined or not a string

      const languageArray: string[] = Array.isArray(languages)
        ? languages
        : typeof languages === "string"
        ? JSON.parse(languages) // Use JSON.parse to convert the string into an array
        : []; // Default to an empty array if skills is undefined or not a string

      const response = await userModel.updateOne(
        { _id: userID },
        {
          $set: {
            title: name,
            description: description,
            languages: languageArray,
            skills: skillsArray,
            profilePicture: profileUrl,
            role: "freelancer",
            hasFreelancerAccount: true,
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async findFreelancerById(id: string) {
    try {
      const freelancer = await userModel.findOne({ _id: id });
      return freelancer;
    } catch (error) {
      console.error();
    }
  }

  async switchToBuying(userID: string) {
    try {
      const freelancer = await userModel.updateOne(
        { _id: userID },
        { $set: { role: "client" } }
      );
      return freelancer;
    } catch (error) {
      console.error();
    }
  }

  async switchToSelling(userID: string) {
    try {
      const freelancer = await userModel.updateOne(
        { _id: userID },
        { $set: { role: "freelancer" } }
      );
      return freelancer;
    } catch (error) {
      console.error();
    }
  }
  // async jobList(
  //   projectType: string,
  //   minPrice: string,
  //   maxPrice: string,
  //   skills: string[],
  //   deliveryDays: string,
  //   sort: string,
  //   search:string
  // ) {
  //   try {
  //     const query: {
  //       isDelete: boolean;
  //       paymentType?: string;
  //       fixedPrice?: { $gte?: number; $lte?: number };
  //       $and?: { "hourlyPrice.from"?: { $gte: number }; "hourlyPrice.to"?: { $lte: number } }[];
  //       skills?: { $in: string[] };
  //     } = {
  //       isDelete: false,
  //     };
  
  //     if (projectType) {
  //       query.paymentType = projectType;
  //     }
  
  //     // Handle price filters
  //     if (minPrice || maxPrice) {
  //       const min = minPrice ? parseInt(minPrice, 10) : undefined;
  //       const max = maxPrice ? parseInt(maxPrice, 10) : undefined;
  
  //       if (projectType === 'fixed') {
  //         query.fixedPrice = {};
  //         if (min !== undefined) query.fixedPrice.$gte = min;
  //         if (max !== undefined) query.fixedPrice.$lte = max;
  //       } else if (projectType === 'hourly') {
  //         query.$and = [];
  //         if (min !== undefined) {
  //           query.$and.push({ "hourlyPrice.from": { $gte: min } });
  //         }
  //         if (max !== undefined) {
  //           query.$and.push({ "hourlyPrice.to": { $lte: max } });
  //         }
  //       }
  //     }
  
  //     // Handle skills filter
  //     if (skills && skills.length > 0) {
  //       query.skills = { $in: skills };
  //     }
  
  //     // Handle sorting based on the 'sort' parameter
  //     let sortOption = {};
  //     if (sort === 'lowToHigh') {
  //       if (projectType === 'fixed') {
  //         sortOption = { fixedPrice: 1 };  // Ascending order for fixedPrice
  //       } else if (projectType === 'hourly') {
  //         sortOption = { "hourlyPrice.from": 1 };  // Ascending order for hourlyPrice
  //       }
  //     } else if (sort === 'highToLow') {
  //       if (projectType === 'fixed') {
  //         sortOption = { fixedPrice: -1 };  // Descending order for fixedPrice
  //       } else if (projectType === 'hourly') {
  //         sortOption = { "hourlyPrice.from": -1 };  // Descending order for hourlyPrice
  //       }
  //     }
  //     if(search){

  //     }
  
  //     // Execute query with sorting
  //     const jobList = await jobPostModel.find(query).sort(sortOption);
  //     return jobList;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
  
  async jobList(
    projectType: string,
    minPrice: string,
    maxPrice: string,
    skills: string[],
    deliveryDays: string,
    sort: string,
    search: string,
    page:string,
    experience:string,
  ) {
    try {
      const query: {
        isDelete: boolean;
        paymentType?: string;
        fixedPrice?: { $gte?: number; $lte?: number };
        $and?: { "hourlyPrice.from"?: { $gte: number }; "hourlyPrice.to"?: { $lte: number } }[];
        skills?: { $in: string[] };
        title?: { $regex: string, $options: string };  
        experience?:string
      } = {
        isDelete: false,
      };
  
      if (projectType) {
        query.paymentType = projectType;
      }
  
      // Handle price filters
      if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice, 10) : undefined;
        const max = maxPrice ? parseInt(maxPrice, 10) : undefined;
  
        if (projectType === 'fixed') {
          query.fixedPrice = {};
          if (min !== undefined) query.fixedPrice.$gte = min;
          if (max !== undefined) query.fixedPrice.$lte = max;
        } else if (projectType === 'hourly') {
          query.$and = [];
          if (min !== undefined) {
            query.$and.push({ "hourlyPrice.from": { $gte: min } });
          }
          if (max !== undefined) {
            query.$and.push({ "hourlyPrice.to": { $lte: max } });
          }
        }
      }
  
      // Handle skills filter
      if (skills && skills.length > 0) {
        query.skills = { $in: skills };
      }
  
      // Handle search by title with regex
      if (search) {
        query.title = { $regex: search, $options: 'i' };  // 'i' for case-insensitive search
      }
  
      // Handle sorting based on the 'sort' parameter
      let sortOption = {};
      if (sort === 'lowToHigh') {
        if (projectType === 'fixed') {
          sortOption = { fixedPrice: 1 };  // Ascending order for fixedPrice
        } else if (projectType === 'hourly') {
          sortOption = { "hourlyPrice.from": 1 };  // Ascending order for hourlyPrice
        }
      } else if (sort === 'highToLow') {
        if (projectType === 'fixed') {
          sortOption = { fixedPrice: -1 };  // Descending order for fixedPrice
        } else if (projectType === 'hourly') {
          sortOption = { "hourlyPrice.from": -1 };  // Descending order for hourlyPrice
        }
      }
      
      if(experience && experience !="any"){
        query.experience = experience;

      }
      // Execute query with sorting
      const skip =parseInt(page) *3 -3
      const jobList = await jobPostModel.find(query).sort(sortOption).skip(skip).limit(3)
      const count = await jobPostModel.countDocuments(query);
      return {jobList,count};
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  async  getJobListCount(){
    try{
      const count = await jobPostModel.countDocuments({ isDelete: false });
      return count
    }catch(error){
      throw error
    }
  }
  
  async editProfile(data: any, portfolioUrl: string) {
    try {
      const { userID, name, title, description, skills } = data;
      console.log("repo portfo",portfolioUrl);

      const updateObject: any = {};
      if (name) {
        updateObject.name = name;
      }

      if (title) {
        updateObject.title = title;
      }

      if (description) {
        updateObject.description = description;
      }
      if (skills) {
        updateObject.skills = skills;
      }
      if (portfolioUrl) {
        const portfolioItem = {
          image: portfolioUrl, // Set the image URL
          title: title || "", // Optionally add a title
          description: description || "", // Optionally add a description
        };

        // Use $push to add the new portfolio item to the existing array
        const updatedPortfolio = await userModel.findOneAndUpdate(
          { _id: userID }, // Filter: find user by userID
          { $push: { portfolio: portfolioItem } }, // Push new portfolio item to the array
          { new: true, projection: { password: 0 } } // Option: return the updated document
        );
        return updatedPortfolio;
      }
      // Update the user by userID
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userID }, // Filter: find user by userID
        { $set: updateObject }, // Update: set the new name (and other fields)
        { new: true, projection: { password: 0 } } // Option: return the updated document
      );

      return updatedUser; // Return the result of the update operation
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async jobDetails(jobID: string) {
    try {
      const jobDetails = await jobPostModel.findOne({ _id: jobID });
      return jobDetails;
    } catch (error) {
      console.error(error);
      throw error
    }  
  }

  async isExistingBidder(jobId:string,userId:string){
    try{
      const isExistingBidder = await BidModel.findOne({jobId:jobId,freelancerId:userId,status:{$ne:"Withdrawn"}})
      return isExistingBidder
    }catch(error){
      throw error
    }
  }

  async submitBid(jobId:string,freelancerId:string,bidAmount:string,deliveryDays:string,proposal:string){
    try {
      const bid = new BidModel({
        jobId:jobId,
        freelancerId:freelancerId,
        bidAmount:bidAmount,
        deliveryDays:deliveryDays,
        proposal:proposal
      })
      await bid.save();
      const populatedBid = await BidModel.findById(bid._id).populate("jobId").populate("freelancerId")
      return populatedBid;
    } catch (error) {
      console.error(error);
      throw error
    }
  }



async getAllBids(jobId:string){
  try{
    const allBids = await BidModel.find({jobId:jobId,status:{$ne:"withdrawn"}}).populate("freelancerId").sort({ createdAt: -1 })
    return allBids
  }catch(error){
    throw error
  }
}

async editBid(data: Partial<IBid>){
  try{
    const {_id,bidAmount,deliveryDays,proposal} =data
    const dataToUpdate: Partial<IBid> = {}
    if(bidAmount){
      dataToUpdate.bidAmount = bidAmount
    }
    if(deliveryDays){
      dataToUpdate.deliveryDays = deliveryDays
    }
    if(proposal){
      dataToUpdate.proposal = proposal
    }
    
    const editBid = await BidModel.findOneAndUpdate({_id:_id},{$set:dataToUpdate},{ new: true }).populate("freelancerId")
    
    return editBid
  }catch(error){
    throw error
  }
}

async myBids(userId:string){
  try{
    const allMyBids = await BidModel.find({freelancerId:userId},{createdAt:1,bidAmount:1,_id:1,status:1}).populate("jobId","title").sort({ createdAt: -1 })
    return allMyBids
  }catch(error){
    throw error
  }
}


async myBidDetails(bidID:string){
  try{
    const myBidDetails = await BidModel.findOne({_id:bidID}).populate("jobId")
    return myBidDetails
  }catch(error){
    throw error
  }
}

async withdrawBid(bidId:string){
  try{
    
    const withdraw = await BidModel.findOneAndUpdate({_id:bidId},{$set:{status:"Withdrawn"}},{ new: true }).populate('jobId')
    return withdraw
  }catch(error){
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

async deletePortFolioImg(imageId:string,userId:string){
  try{
    
    const deletePortfolio = await userModel.updateOne(
      { _id: userId },
      { $pull: { portfolio: { _id: imageId } } }
    );
    deletePortfolio
  }catch(error){
    throw error
  }
}

async storeNotification(userID:string,freelancerId:string,freelancerName:string,createdAt:string,bidAmount:string){
  try{
    const newNotification =  notificationModel.create({
      userID:userID,
      freelancerId:freelancerId,
      freelancerName:freelancerName,
      bidAmount:bidAmount,
      createdAt:createdAt,
    })
    return newNotification
  }catch(error){
     throw error    
  }
}

async getMyOrders(freelancerId:string){
  try{
    const orders = await OrderModel.find({ freelancerId: freelancerId })
    .populate({ path: "projectId", select: "title description" })
    .populate({ path: "bidId", select: "deliveryDays" })
    .populate({ path: "clientId", select: "profilePicture" });
      return orders
  }catch(error){
    throw error
  }
}

async completeOrder(orderId:string,description:string,file:string){
  try{
    
    const uploadDate = new Date()
    const orders = await OrderModel.updateOne({ _id: orderId },{$set:{delivery:{description:description,fileUrl:file,uploadDate:uploadDate},status:"Completed"}})
    return orders
  }catch(error){
    throw error
  }
}
}
