import { Request, Response } from "express";
import { FreelancerUseCaseInterface } from "../../application/useCases/interfaces/IFreelancerUseCase";
import { Cloudinary } from "../../application/services/cloudinary";

export class FreelancerController {
  private freelancerUseCase: FreelancerUseCaseInterface;
  constructor(freelancerUseCase: FreelancerUseCaseInterface) {
    this.freelancerUseCase = freelancerUseCase;
  }

  async createFreelancerAccount(req: Request, res: Response) {
    try {
      const profileImagePath = req.file?.path || null;

      const createFreelancer = await this.freelancerUseCase.createFreelancer(
        req.body,
        profileImagePath
      );
      if (createFreelancer) {
        const freelancerData = await this.freelancerUseCase.findFreelancerById(
          req.body.userID
        );
        res.json({ success: true, freelancerData });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async switchToBuying(req: Request, res: Response) {
    try {
      const switchToBuying = await this.freelancerUseCase.switchToBuying(
        req.body.userID
      );
      if (switchToBuying) {
        const freelancerData = await this.freelancerUseCase.findFreelancerById(
          req.body.userID
        );
        res.json({ success: true, freelancerData });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async switchToSelling(req: Request, res: Response) {
    try {
      const switchToBuying = await this.freelancerUseCase.switchToSelling(
        req.body.userID
      );
      if (switchToBuying) {
        const freelancerData = await this.freelancerUseCase.findFreelancerById(
          req.body.userID
        );
        res.json({ success: true, freelancerData });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getJobList(req: Request, res: Response) {
    try {
      const jobList = await this.freelancerUseCase.getJobList();
      res.status(200).json({ success: true, jobList: jobList });
    } catch (error) {
      console.error();
    }
  }

  async editprofile(req: Request, res: Response) {
    try {
      const updatedProfile = await this.freelancerUseCase.editProfile(
        req.body,
        req.file ?? null
      );
      console.log(req.file);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the profile",
      });
    }
  }

  async getJobDetails(req: Request, res: Response) {
    try {
      const {jobID} =req.body
      const jobDetails = await this.freelancerUseCase.getJobDetails(jobID)

      return res.status(200).json({
        success: true,
        message: "job details fetched successfully",
        jobDetails: jobDetails,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching job details",
      });
    }
  }
}
