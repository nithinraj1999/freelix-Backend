import { Request, Response, NextFunction } from "express";

import { IAdminSkillUseCase } from "../../../domain/interfaces/admin/useCases/IAdminSkillUseCase";

export class SkillController {
    constructor(private adminSkillsUseCase: IAdminSkillUseCase) {}
  
    async addSkills(req: Request, res: Response, next: NextFunction) {
      try {
        const { skill, description } = req.body;
        const response = await this.adminSkillsUseCase.addSkills(skill, description);
        res.json({ success: !!response });
      } catch (error) {
        next(error);
      }
    }
  
    async getAllSkills(req: Request, res: Response, next: NextFunction) {
      try {
        const skills = await this.adminSkillsUseCase.getAllSkills();
        res.json({ success: !!skills, skills });
      } catch (error) {
        next(error);
      }
    }
  }
  