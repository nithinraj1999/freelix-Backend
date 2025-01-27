import { Request, Response } from "express";
import { IUserUseCase } from "../../application/useCases/interfaces/IUserUseCase";
import { jwtInterface } from "../../application/services/interfaces/jwtInterface";
import { User as UserEntity } from "../../domain/entities/user"; 
import { NotificationService } from "../../application/services/notificationService";
import { userSocketMap } from "../../application/services/socket";
import Stripe from "stripe";
import { S3Bucket } from "../../application/services/s3bucket";
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream'; // Node.js stream module

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
        if (verify) {
            res.status(201).json({ success: true, message: "otp verified." });
        }else{
          res.json({ success: false, message: "otp not verified." });
        }
    } catch (error) {
        // res.status(500).json({ success: false, message: "otp not verified." });
        console.log(error);
        
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
      const { userID,searchQuery,page } = req.body;
   
      
      const jobPosts = await this.userUseCase.getAllJobPosts(userID,searchQuery,page);
      res.status(200).json({ success: true, jobPosts });
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
      const {freelancerId} = req.body
      const details = await this.userUseCase.fetchFreelancerDetails(freelancerId);

   res.status(200).json({success:true,freelancerDetails:details})
   }catch(error){
     console.error(error);
     res.status(500).json({success:false})
   }
  }


  async fetchAllNotifications(req: Request, res: Response){
    try{
      
     const {userID} = req.body
     const notifications = await this.userUseCase.fetchAllNotifications(userID);

   res.status(200).json({success:true,notifications:notifications})
   }catch(error){
     console.error(error);
     res.status(500).json({success:false})
   }
  }

  async getSkills(req: Request, res: Response){
    try{
   const skills = await this.userUseCase.getSkills();
   res.status(200).json({success:true,skills:skills})
   }catch(error){
     console.error(error);
     res.status(500).json({success:false})
   }
  }

  async makePayment(req: Request, res: Response){
    try{
      const {bidAmount,userId,bidId,freelancerId,jobId} = req.body
      const order = await this.userUseCase.storeOrder(bidAmount,userId,bidId,freelancerId,jobId);
      const stripe = new Stripe(process.env.STRIPE_SECRET as string);
      const lineItems = [
        {
          price_data: {
            currency: 'usd', 
            product_data: {
              name: 'Product 1', 
            },
            unit_amount: bidAmount*100, 
          },
          quantity: 1, 
        },
      ];
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:process.env.STRIPE_SUCCESS_URL,
        cancel_url:process.env.STRIPE_CANCEL_URL,
      })
      
      res.json({id:session.id})
    }catch(error){ 
      console.error(error);
    }  
  }

  async getAllHiring(req: Request, res: Response){
    try{
      
      const {clientId} = req.body
      const allHirings = await this.userUseCase.getAllHirings(clientId);
      if(allHirings){
        res.status(200).json({success:true,allHirings:allHirings})
      }else{
        res.status(404).json({ success: false, message: "No hirings found" });
      }
 
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }

  async releasePayment(req: Request, res: Response){
    try{
        const {projectId,clientId,freelancerId,total} =req.body
        const allHirings = await this.userUseCase.releasePayment(projectId,clientId,freelancerId,total);
        res.status(200).json({success:true})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }


  async submitReview(req: Request, res: Response){
    try{
      const {clientId,freelancerId,review,rating} = req.body
      const submission = await this.userUseCase.submitReview(clientId,freelancerId,review,rating);

      res.status(200).json({success:true})
  }catch(error){
    console.error(error);
    res.status(500).json({success:false})
  }
  }
   
  async fetchAllContacts(req: Request, res: Response){
    try{
      const {userId} =req.body
      const allContacts = await this.userUseCase.fetchAllContacts(userId);
      res.status(200).json({success:true,allContacts:allContacts})

    }catch(error){
      console.error(error);
      res.status(500).json({success:false})
    }
  }

  async fetchChat(req: Request, res: Response){
    try{
      const {userId,contactId} =req.query
      const chat = await this.userUseCase.fetchChat(userId as string, contactId as string);
      res.status(200).json({success:true,chat:chat})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false})

    }

  }


  async forgetPassword(req: Request, res: Response){
    try{
      const {email} = req.body
      
      const sendEmail = await this.userUseCase.resetPassword(email)
      res.json(sendEmail)
    }catch(error){
      console.log(error);
      
    }
  }

  async resetPassword(req: Request, res: Response){
    try{
      const {params,password,confirmPassword} =req.body
      const userId = params
      const updatedPassword = await this.userUseCase.validateAndStorePassword(userId,password,confirmPassword)
      res.json(updatedPassword)
    }catch(error){
      console.error(error);
      
    }
  }

  async getUserData(req: Request, res: Response){
    try{
      const {userId} =req.body
      const userDetails = await this.userUseCase.getUserData(userId)
      res.json({success:true,userDetails:userDetails})
    }catch(error){
      console.error(error);
      
    }
  }

  async editData(req: Request, res: Response) {
    try {
      const { name, email, userId } = req.body;
      const userDetails = await this.userUseCase.editData(req.file, name, email, userId);
      
      if (!userDetails) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      res.json({ success: true, message: "User details updated successfully.", data: userDetails });
    } catch (error) {
      console.error("Error in editData:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
  

  async  downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;

      const deliverable = await this.userUseCase.getDeliverable(orderId);
      const file = deliverable.delivery.fileUrl;
  
      const baseUrl = "https://freelixs3.s3.eu-north-1.amazonaws.com/";
      const fileKey = file.startsWith(baseUrl) ? file.replace(baseUrl, "") : file;
  
      const awsS3instance = new S3Bucket();
      const response: GetObjectCommandOutput = await awsS3instance.downloads3Object(fileKey);
  
      if (response.Body && response.Body instanceof Readable) {
        console.log(response.ContentType);
  
        res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
        res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
  
        response.Body.pipe(res);
      } else {
        res.status(400).json({ success: false, message: "File not found or unable to retrieve file" });
      }
  
  
    } catch (error) {
      console.error("Error while downloading", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
  
}
