import { User } from "../entities/user";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  saveUserOtp(id:string,otp:string,email:string):Promise<any>;
  findOTP(otp:string,id:string):Promise<Boolean>
  findById(userID:string):Promise<User | null>;
}
