// import { User } from "../entities/user";
import { User } from "../../../domain/entities/user";
import { IJobPost } from "../../models/jobPostModel";
export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  saveUserOtp(id:string,otp:string,email:string):Promise<any>;
  findOTP(otp:string,id:string):Promise<Boolean>
  findById(userID:string):Promise<User | null>;
  createJobPost(data:IJobPost,file:string|null):Promise<any>
  getAllFreelancers():Promise<any>
}
