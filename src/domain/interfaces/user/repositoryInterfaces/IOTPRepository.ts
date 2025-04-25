import { User } from "../../../entities/user";
export interface IOTPRepository {
      saveUserOtp(otp:string,email:string, userData: User ):Promise<any>;
      updateUserOtp(otp: string, email: string): Promise<any>
      findOTP(otp: string, email: string):Promise<any>
}