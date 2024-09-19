import { User } from "../entities/user";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  saveUserOtp(id:string,otp:string):Promise<void>;
}
