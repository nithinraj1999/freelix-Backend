import { IFreelancerSkillRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerSkillRepository"
export class FreelancerSkillRepository {
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
