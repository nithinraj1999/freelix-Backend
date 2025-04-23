export interface IAdminSkillUseCase {
    addSkills(skill: string, description: string): Promise<any>;
    getAllSkills(): Promise<any>;
  }
  