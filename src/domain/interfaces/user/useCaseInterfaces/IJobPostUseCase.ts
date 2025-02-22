import { IJobPost } from "../../../entities/jobPost";

export interface IJobPostUseCase{
    createJobPost(data: IJobPost, file: string | null):Promise<any>
    getAllJobPosts(userID:string,searchQuery:string,page:string):Promise<any>
    deleteJobPost(jobId:string):Promise<any>
    editPost(data:any):Promise<any>
    jobDetails(jobId:string):Promise<any>
    getAllFreelancers():Promise<any>
}