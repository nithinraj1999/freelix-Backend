import { IFreelancerJobPostRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerJobPostRepository";
import { IFreelancerJobPostUseCase } from "../../../domain/interfaces/freelancer/useCases/IFreelancerJobPostUseCase";

export class FreelancerJobPostUseCase implements IFreelancerJobPostUseCase {

    constructor(private readonly freelancerJobPostRepository: IFreelancerJobPostRepository) {}
    
    async getJobList(projectType: string, minPrice: string, maxPrice: string, skills: any, deliveryDays: string, sort: string, search: string, page: string, experience: string, freelancerSkills: any) {
      return this.freelancerJobPostRepository.jobList(projectType, minPrice, maxPrice, skills, deliveryDays, sort, search, page, experience, freelancerSkills);
    }
  
    async getJobListCount() {
      return this.freelancerJobPostRepository.getJobListCount();
    }
  
    async getJobDetails(jobID: string) {
      return this.freelancerJobPostRepository.jobDetails(jobID);
    }
  }
  