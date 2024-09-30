import { User } from "../../../domain/entities/user";

export interface IUserUseCase{
    registerUser(data: User): Promise<void>;
    verification(otp:string,userID:string) :Promise<any>
    authenticateUser(email:string,password:string) :Promise<any>
    resendOTP(userID:string):Promise<any>
}