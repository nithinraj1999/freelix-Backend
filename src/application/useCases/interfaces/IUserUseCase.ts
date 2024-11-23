import { User } from "../../../domain/entities/user";

export interface IUserUseCase{
    registerUser(data: User): Promise<void>;
    verification(otp:string,email:string) :Promise<any>
    authenticateUser(email:string,password:string) :Promise<any>
    resendOTP(email:string):Promise<any>
    createJobPost(data:object,file:string | null):Promise<any>
    getAllFreelancers():Promise<any>;
    getAllJobPosts(userID:string):Promise<any>;
    deleteJobPost(jobId:string):Promise<any>;
    editPost(data:any):Promise<any>;
    jobDetails(jobId:string):Promise<any>;
    fetchAllBids(jobId:string):Promise<any>;
    fetchFreelancerDetails(freelancerId:string):Promise<any>;
    fetchAllNotifications(userID:string):Promise<any>
    getSkills():Promise<any>
    storeOrder(bidAmount:string,userId:string,bidId:string,freelancerId:string,jobId:string):Promise<any>
    getAllHirings(clientId:string):Promise<any>
    releasePayment(projectId:string,clientId:string,freelancerId:string,total:string):Promise<any>
    submitReview(clientId:string,freelancerId:string,review:string):Promise<any>
    fetchAllContacts(userId:string):Promise<any>
    fetchChat(userId:string,contactId:string):Promise<any>
    resetPassword(email:string):Promise<any>

    validateAndStorePassword(userId:string,password:string,confirmPassword:string):Promise<any>
    getUserData(userId:string):Promise<any>
    editData(profilePicture:string,name:string,email:string,userId:string):Promise<any>
}