import { IJobPost } from "../../../entities/jobPost"
export interface IJobPostRepository{
    createJobPost(data: IJobPost, file: string | null):Promise<IJobPost>
    getAllJobPosts(userID: string, searchQuery: string, page: string):Promise<{ MyPost: IJobPost[]; totalDocs: number }> 
    deleteJobPost(jobId: string):Promise<any>
    editPost(data: any):Promise<any>
    jobDetails(jobId: string):Promise<any>
}