import { User } from "../../../domain/entities/user";

export interface IUserUseCase{
    registerUser(data: User): Promise<void>;
    verification(otp:string,userID:string) :Promise<any>
    authenticateUser(email:string,password:string) :Promise<any>
    resendOTP(userID:string):Promise<any>
    createJobPost(data:object,file:string | null):Promise<any>
    getAllFreelancers():Promise<any>;
    getAllJobPosts(userID:string):Promise<any>;
    deleteJobPost(jobId:string):Promise<any>;
    editPost(data:any):Promise<any>;
    jobDetails(jobId:string):Promise<any>;
    fetchAllBids(jobId:string):Promise<any>;
}