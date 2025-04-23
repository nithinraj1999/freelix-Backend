import { IAdminSkillsRepository } from "../../../domain/interfaces/admin/repository/IAdminSkillsRepository"
import { IAdminSkillUseCase } from "../../../domain/interfaces/admin/useCases/IAdminSkillUseCase"
export class AdminSkillUseCase implements IAdminSkillUseCase{
    constructor(private adminSkillRepository: IAdminSkillsRepository) {}
  
    addSkills(skill: string, description: string) {
      return this.adminSkillRepository.addSkills(skill, description)
    }
  
    getAllSkills() {
      return this.adminSkillRepository.getAllSkills()
    }
  }
  