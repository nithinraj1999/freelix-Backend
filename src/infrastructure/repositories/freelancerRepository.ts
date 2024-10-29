import { IFreelancer } from "../../domain/entities/freelancer";
import { IFreelancerRepository } from "./interface/freelancerRepositoryInterface";
import userModel from "../models/userModel";
import jobPostModel from "../models/jobPostModel";
import { Cloudinary } from "../../application/services/cloudinary";
import BidModel from "../models/bidModel";
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

  async jobList() {
    try {
      const jobList = await jobPostModel.find({});
      return jobList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async editProfile(data: any, portfolioUrl: string) {
    try {
      const { userID, name, title, description, skills } = data;
      console.log(portfolioUrl);

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
      const isExistingBidder = await BidModel.findOne({jobId:jobId,freelancerId:userId})
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
    const allBids = await BidModel.find({jobId:jobId}).populate("freelancerId").sort({ createdAt: -1 })
    return allBids
  }catch(error){
    throw error
  }
}

}
