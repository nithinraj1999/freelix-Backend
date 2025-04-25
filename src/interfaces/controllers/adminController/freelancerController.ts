import { Request, Response, NextFunction } from "express";
import { IAdminFreelancerUseCase } from "../../../domain/interfaces/admin/useCases/IAdminFreelancerUseCase";
export class AdminFreelancerController {
    constructor(private adminFreelancerUseCase: IAdminFreelancerUseCase) {}
  
    async getFreelancerData(req: Request, res: Response, next: NextFunction) {
      try {
        const freelancers = await this.adminFreelancerUseCase.getFreelancerData();
        res.json({ success: true, freelancers });
      } catch (error) {
        next(error);
      }
    }
  
    async blockFreelancer(req: Request, res: Response, next: NextFunction) {
      try {
        const response = await this.adminFreelancerUseCase.blockFreelancer(req.body.freelancerID);
        res.json({ success: !!response, message: response ? "Blocked" : "Failed", freelancer: response });
      } catch (error) {
        next(error);
      }
    }
  
    async unblockFreelancer(req: Request, res: Response, next: NextFunction) {
      try {
        const response = await this.adminFreelancerUseCase.unblockFreelancer(req.body.freelancerID);
        res.json({ success: !!response });
      } catch (error) {
        next(error);
      }
    }
  
    async createFreelancer(req: Request, res: Response, next: NextFunction) {
      try {
        await this.adminFreelancerUseCase.createFreelancer(req.body, req.file);
        res.json({ success: true, message: "Freelancer created successfully" });
      } catch (error) {
        next(error);
      }
    }
  
    async editFreelancer(req: Request, res: Response, next: NextFunction) {
      try {
        const data = req.body;
        const skills = JSON.parse(data.skills);
        const languages = JSON.parse(data.languages);
        const profilePicPath = req.file?.path || null;
  
        const updated = await this.adminFreelancerUseCase.editFreelancer({ ...data, skills, languages }, profilePicPath);
        res.json({ success: true, message: "Freelancer updated successfully", data: updated });
      } catch (error) {
        next(error);
      }
    }
  }
  