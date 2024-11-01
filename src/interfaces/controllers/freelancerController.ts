import { Request, Response } from "express";
import { FreelancerUseCaseInterface } from "../../application/useCases/interfaces/IFreelancerUseCase";
import { Cloudinary } from "../../application/services/cloudinary";
import { jwtInterface } from "../../application/services/interfaces/jwtInterface";

export class FreelancerController {
  private freelancerUseCase: FreelancerUseCaseInterface;
  private jwt: jwtInterface;
  constructor(
    freelancerUseCase: FreelancerUseCaseInterface,
    jwt: jwtInterface
  ) {
    this.freelancerUseCase = freelancerUseCase;
    this.jwt = jwt;
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
        const accessToken = await this.jwt.generateAccessToken({
          _id: req.body.userID,
          role: "client",
        });

        const refreshToken = await this.jwt.generateRefreshToken({
          _id: req.body.userID,
          role: "client",
        });

        res.cookie("userRefreshJWT", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const freelancerData = await this.freelancerUseCase.findFreelancerById(
          req.body.userID
        );
        res.json({ success: true, freelancerData, accessToken: accessToken });
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
        const accessToken = await this.jwt.generateAccessToken({
          _id: req.body.userID,
          role: "freelancer",
        });

        const refreshToken = await this.jwt.generateRefreshToken({
          _id: req.body.userID,
          role: "freelancer",
        });

        res.cookie("userRefreshJWT", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        const freelancerData = await this.freelancerUseCase.findFreelancerById(
          req.body.userID
        );
        res.json({ success: true, freelancerData, accessToken: accessToken });
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
      const { jobID } = req.body;
      const jobDetails = await this.freelancerUseCase.getJobDetails(jobID);

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

  async isExistingBidder(req: Request, res: Response) {
    try {
      const { jobId, userId } = req.body;

      const isExistingBidder =
        await this.freelancerUseCase.isBidderAlreadyExist(jobId, userId);
      if (isExistingBidder) {
        res.json({ isExist: true });
      } else {
        res.json({ isExist: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
      });
    }
  }

  async submitBid(req: Request, res: Response) {
    try {
      const { jobId, freelancerId, bidAmount, deliveryDays, proposal } =
        req.body;

      const bid = await this.freelancerUseCase.submitBid(
        jobId,
        freelancerId,
        bidAmount,
        deliveryDays,
        proposal
      );
      res.status(200).json({ success: true, bid: bid });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while submiting bid",
      });
    }
  }

  async getAllBids(req: Request, res: Response) {
    try {
      const { jobId } = req.body;
      const allBids = await this.freelancerUseCase.getAllBids(jobId);
      res.status(200).json({ success: true,allBids:allBids});
    } catch (error) {
      res.json({ success: false});
      console.error();
    }
  }

  async editMyBid(req: Request, res: Response){
    try{
      const data = req.body
      const bidEdit = await this.freelancerUseCase.editBid(data);
    res.status(200).json({success:true,editedBid:bidEdit})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }

  
  async myBids(req: Request, res: Response){
    try{
       const {userId} = req.body
       const myBids = await this.freelancerUseCase.myBids(userId);

    res.status(200).json({success:true,myBids:myBids})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }

  
  async myBidDetails(req: Request, res: Response){
    try{
       const {bidID} = req.body
       
       const myBidDetails = await this.freelancerUseCase.myBidDetails(bidID);

    res.status(200).json({success:true,myBidDetails:myBidDetails})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }

  async withdrawBid(req: Request, res: Response){
    try{
       const {bidId} = req.body
       console.log(bidId);
       
       const withdraw = await this.freelancerUseCase.withdrawBid(bidId);

    res.status(200).json({success:true})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }


}
