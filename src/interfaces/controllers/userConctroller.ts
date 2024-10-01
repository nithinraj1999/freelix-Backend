import { Request, Response } from "express";
import { IUserUseCase } from "../../application/useCases/interfaces/IUserUseCase";

export class UserController {
  private userUseCase: IUserUseCase;
  constructor(userUseCase: IUserUseCase) {
    this.userUseCase = userUseCase;
  }

  //================================== user registration =======================================

  async register(req: Request, res: Response) {
    try {
      const user = await this.userUseCase.registerUser(req.body);
      res.status(201).json({
        userID: user,
        message:
          "User registration successful. Please verify the OTP sent to your email.",
      });
    } catch (err) {
      throw err;
    }
  }

  async verification(req: Request, res: Response) {
    try {
      const { otp, userID } = req.body;
      const verify = await this.userUseCase.verification(otp, userID);
      if (verify) {
        const token = verify.token;
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ success: true, message: "otp verified." });
      } else {
        res.json({ success: false, message: "otp not verified." });
      }
    } catch (error) {
      throw error;
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

      res
        .status(200)
        .json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone, 
            role: user.role,
            hasFreelancerAccount:user.hasFreelancerAccount,
            profilePicture:user.profilePicture,
            isBlock: user.isBlock,
            isVerified: user.isVerified,
            description:user.description,
            skills:user.skills,
            languages:user.languages,
            isFreelancerBlock:user.isFreelancerBlock,

          },
          message: "Login successfull",
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  }



  async resendOTP(req: Request, res: Response){
    try{
      const {userID} = req.body
      const resend = await this.userUseCase.resendOTP(userID);
      res.json({success:true})
    }catch(error){
      throw error
    }
  } 
  
}
