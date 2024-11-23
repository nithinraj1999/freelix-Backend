// import { User } from "../entities/user";
import { User } from "../../../domain/entities/user";
import { IJobPost } from "../../models/jobPostModel";
export interface IUserRepository {
  save(user: User): Promise<User>;
  checkEmailExist(email: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  saveUserOtp(otp:string,email:string, userData: User ):Promise<any>;
  updateUserOtp( otp:string,email:string):Promise<any>;
  // saveUserOtp(id:string,otp:string,email:string):Promise<any>;
  findOTP(otp:string,id:string):Promise<any>
  findById(userID:string):Promise<User | null>;
  createJobPost(data:IJobPost,file:string|null):Promise<any>
  getAllFreelancers():Promise<any>
  getAllJobPosts(userID:string):Promise<any>;
  deleteJobPost(jobId:string):Promise<any>
  editPost(data:any):Promise<any>
  jobDetails(jobId:string):Promise<any>
  allBids(jobId:string):Promise<any>
  getFreelancerDetails(freelancerId:string):Promise<any>
  fetchAllNotifications(userID:string):Promise<any>
  getSkills():Promise<any>
  storeOrder(bidAmount:string,userId:string,bidId:string,freelancerId:string,jobId:string):Promise<any>
  getAllHirings(clientId:string):Promise<any>
  releasePayment(projectId:string,clientId:string,freelancerId:string,total:string):Promise<any>
  submitReview(clientId:string,freelancerId:string,review:string):Promise<any>
  fetchAllContacts(userId:string):Promise<any>
  fetchChat(userId:string,contactId:string):Promise<any>
  updatePassword(userId:string,password:string):Promise<any>
  getUserData(userId:string):Promise<any>
  editData(profilePicture:string,name:string,email:string,userId:string):Promise<any>
}
