import { Request, Response } from "express";
import { FreelancerUseCaseInterface } from "../../application/useCases/interfaces/IFreelancerUseCase";

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
      if(createFreelancer){
        const freelancerData = await this.freelancerUseCase.findFreelancerById (req.body.userID)
        res.json({success:true,freelancerData})
      }
    } catch (error) {
      console.error(error);
    }
  }


async switchToBuying(req: Request, res: Response) {
    try {      
      const switchToBuying = await this.freelancerUseCase.switchToBuying(
        req.body.userID,
      );
      if(switchToBuying){
        const freelancerData = await this.freelancerUseCase.findFreelancerById (req.body.userID)
        res.json({success:true,freelancerData})
      }
    } catch (error) {
      console.error(error);
    }
  }

  async switchToSelling(req: Request, res: Response) {
    try {
      const switchToBuying = await this.freelancerUseCase.switchToSelling(
        req.body.userID,
      );
      if(switchToBuying){
        const freelancerData = await this.freelancerUseCase.findFreelancerById (req.body.userID)
        res.json({success:true,freelancerData})
      }
    } catch (error) {
      console.error(error);
    }
  }
 
}
