import { IJobPost } from "../../../../domain/entities/jobPost";
import { IJobPostRepository } from "../../../../domain/interfaces/user/repositoryInterfaces/IJobPostRepository";
import { IJobPostUseCase } from "../../../../domain/interfaces/user/useCaseInterfaces/IJobPostUseCase";

export class JobPostUsecase implements IJobPostUseCase{

    private jobPostRepository:IJobPostRepository;
    private freelancerrepository

    constructor(jobPostRepository:IJobPostRepository,freelancerrepository:any) {
        this.jobPostRepository = jobPostRepository
        this.freelancerrepository = freelancerrepository
    }

    async createJobPost(data: IJobPost, file: string | null) {
      try {
        const response = await this.jobPostRepository.createJobPost(data, file);
        return response;
      } catch (error) {
        throw error;
      }
    }

    async getAllJobPosts(userID:string,searchQuery:string,page:string){ 
        try{
          const MyjobPosts = await this.jobPostRepository.getAllJobPosts(userID,searchQuery,page);
          return MyjobPosts;
        }catch(error){
          console.error(error);
        }
      }

      async deleteJobPost(jobId:string){
        try{
          const deletedJobPost = await this.jobPostRepository.deleteJobPost(jobId);
          return deletedJobPost;
        }catch(error){
          console.error(error);
          
        }
      }

      async editPost(data:any){
        try{
          const editedPost = await this.jobPostRepository.editPost(data);
          return editedPost;
        }catch(error){
          console.error(error);
          
        }
      }

      async  jobDetails(jobId:string){
        try{
          const jobDetails = await this.jobPostRepository.jobDetails(jobId);
          return jobDetails
        }catch(error){
          console.error(error);
        }
      }

      
async getAllFreelancers(){
    try {
      const response = await this.freelancerrepository.getAllFreelancers();
      return response;
    } catch (error) {
      console.error("Error in use case:", error);
      throw error;
    }
  }
}