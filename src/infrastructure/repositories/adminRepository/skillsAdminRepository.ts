import skillsModel from "../../models/skillsModel";
import { IAdminSkillsRepository } from "../../../domain/interfaces/admin/repository/IAdminSkillsRepository";

export class SkillsAdminRepository implements IAdminSkillsRepository{
  async addSkills(skill: string, description: string) {
    return await skillsModel.create({ skill, description });
  }
  async getAllSkills() {
    return await skillsModel.find();
  }
}
