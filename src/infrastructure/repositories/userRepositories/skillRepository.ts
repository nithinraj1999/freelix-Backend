import { ISkillRepository } from '../../../domain/interfaces/user/repositoryInterfaces/ISkillRepository'

export class SkillRepository implements ISkillRepository {
    private skillsModel: any
    constructor(skillsModel: any) {
        this.skillsModel = skillsModel
    }
    async getSkills() {
        try {
            const skills = await this.skillsModel.find({}, { skill: 1, _id: 0 })
            return skills
        } catch (error) {
            throw error
        }
    }
}
