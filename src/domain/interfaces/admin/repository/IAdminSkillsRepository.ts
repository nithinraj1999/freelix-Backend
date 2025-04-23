export interface IAdminSkillsRepository {
    addSkills(skill: string, description: string): Promise<any>;
    getAllSkills(): Promise<any[]>;
  }
  