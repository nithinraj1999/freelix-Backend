import { Request, Response } from "express";
import { IUserUseCase } from "../../application/useCases/interfaces/IUserUseCase";
import { jwtInterface } from "../../application/services/interfaces/jwtInterface";
import { User as UserEntity } from "../../domain/entities/user"; // Change this to match your import path
import { NotificationService } from "../../application/services/notificationService";
import { userSocketMap } from "../../application/services/socket";
export class UserController {
  private userUseCase: IUserUseCase;
  private jwt: jwtInterface;

  constructor(userUseCase: IUserUseCase, jwt: jwtInterface) {
    this.userUseCase = userUseCase;
    this.jwt = jwt;
  }

  //================================== user registration =======================================

  async register(req: Request, res: Response) {
    try {
      console.log(req.body);
      const {password,confirmPassword} =req.body
      if(password !== confirmPassword){
        res.json({message:"password is not matching"})
      }else{

    
      const user = await this.userUseCase.registerUser(req.body);
      res.status(201).json({
        success:true,
        userID: user,
        email:req.body.email,
        message:
          "User registration successful. Please verify the OTP sent to your email.",
      });
    }
    } catch (err) {
      res.json({ success: false,message:"Email already exist" });    }
  }

  async verification(req: Request, res: Response) {
    try {
      const { otp, email } = req.body;
      const verify = await this.userUseCase.verification(otp, email);
      
        res.status(201).json({ success: true, message: "otp verified." });
      
    } catch (error) {
      res.json({ success: false, message: "otp not verified." });
      
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userUseCase.authenticateUser(email, password);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      } else {
      }

      const accessToken = await this.jwt.generateAccessToken({
        _id: user._id,
        role: user.role,
      });

      const refreshToken = await this.jwt.generateRefreshToken({
        _id: user._id,
        role: user.role,
      });

      res.cookie("userRefreshJWT", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          hasFreelancerAccount: user.hasFreelancerAccount,
          profilePicture: user.profilePicture,
          isBlock: user.isBlock,
          isVerified: user.isVerified,
          description: user.description,
          skills: user.skills,
          languages: user.languages,
          isFreelancerBlock: user.isFreelancerBlock,
        },
        message: "Login successfull",
        accessToken: accessToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  async resendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const resend = await this.userUseCase.resendOTP(email);
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false,error:error });
    }
  }

  async createJobPost(req: Request, res: Response) {
    try {
      const file = req.file ? req.file.path : null;
      const jobPost = await this.userUseCase.createJobPost(req.body, file);
      const freelancers: UserEntity[] =
        await this.userUseCase.getAllFreelancers(); // Specify the type of freelancers

      const freelancersWithSocketIds = freelancers
        .filter((freelancer) => userSocketMap.has(freelancer._id.toString())) // Keep only freelancers with a valid socket ID
        .map((freelancer) => ({
          ...freelancer,
          socketId: userSocketMap.get(freelancer._id.toString()), // Convert ObjectId to string and get socketId
        }));

      NotificationService.sendJobPostNotification(
        freelancersWithSocketIds,
        jobPost
      );

      res.status(200).json({ success: true, data: jobPost });
    } catch (error) {
      console.error("Error in controller:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create job post" });
    }
  }

  async getAllJobPosts(req: Request, res: Response) {
    try {
      const { userID } = req.body;
      const jobPosts = await this.userUseCase.getAllJobPosts(userID);
      res.status(200).json({ success: true, jobPosts: jobPosts });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch job posts" });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const { jobId } = req.body;
      const deletedJobPost = await this.userUseCase.deleteJobPost(jobId);
      res.status(200).json({ success: true, deletedJobPost: deletedJobPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  async editPost(req: Request, res: Response) {
    try {
      console.log("edit post", req.body);
      const editedPost = await this.userUseCase.editPost(req.body);
      res.status(200).json({ success: true, editedPost: editedPost });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  }

  async jobPostdetails(req: Request, res: Response) {
    try {
      const { jobID } = req.body;
      const jobDetails = await this.userUseCase.jobDetails(jobID);
      res.json({ success: true, jobDetails: jobDetails });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  }

  async fetchAllBids(req: Request, res: Response) {
    try {
      const { jobId } = req.body;
      const bids = await this.userUseCase.fetchAllBids(jobId);
      res.json({success:true,bids:bids})
    } catch (error) {
      console.error(error);
      res.json({success:false})
    }
  }


  
  async fetchFreelancerDetails(req: Request, res: Response){
    try{
      
      console.log(req.body);
      const {freelancerId} = req.body
      const details = await this.userUseCase.fetchFreelancerDetails(freelancerId);

   res.status(200).json({success:true,freelancerDetails:details})
   }catch(error){
     console.error(error);
     res.status(500).json({success:false})
   }
  }

}
