import { IJobPost } from "../../../entities/jobPost"
export interface IJobPostRepository{
    createJobPost(data: IJobPost, file: string | null):Promise<IJobPost>
    getAllJobPosts(userID: string, searchQuery: string, page: string):Promise<{ MyPost: IJobPost[]; totalDocs: number }> 
    deleteJobPost(jobId: string):Promise<IJobPost | undefined>
    editPost(data: any):Promise<IJobPost |null>
    jobDetails(jobId: string):Promise<IJobPost> 
}