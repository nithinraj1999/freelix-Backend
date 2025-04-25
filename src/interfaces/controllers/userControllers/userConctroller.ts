import { Request, Response } from "express";
import { jwtInterface } from "../../../application/services/interfaces/jwtInterface";
import { IUserUseCase } from "../../../domain/interfaces/user/useCaseInterfaces/IUserUseCase";

export class UserController {
  private userUseCase: IUserUseCase;
  private jwt: jwtInterface;

  constructor(userUseCase: IUserUseCase, jwt: jwtInterface) {
    this.userUseCase = userUseCase;
    this.jwt = jwt;
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
  

}
