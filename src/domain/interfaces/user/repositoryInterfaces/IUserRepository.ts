import { User } from "../../../entities/user";

export interface IUserRepository {
  save(user: User): Promise<User>;
  checkEmailExist(email: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  saveUserOtp(otp:string,email:string, userData: User ):Promise<any>;

}