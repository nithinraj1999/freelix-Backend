import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import userModel from "../models/userModel";
import Otp from "../models/otpModel";


export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await userModel.findOne({ email:email,isAdmin:false,isBlock:false });
        if (!user) return null;
        return user
    }

    async save(user: User): Promise<User> {
        const newUser = userModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            role: user.role,
            profilePicture: user.profilePicture,
        });

        
        return newUser
    }

    async saveUserOtp(userId:string,otp:string,email:string):Promise<any>{
        const newOtp = new Otp({
            userID:userId,
            otp:otp,
            email:email
        })
       const otpDoc = await newOtp.save()
       return otpDoc
    }
    
    async findOTP(otp: string, userID: string): Promise<boolean> {
        const matchOTP = await Otp.findOne({ userID: userID, otp: otp });
        if(matchOTP){  
             await userModel.updateOne({_id:userID},{$set:{isVerified:true}})
        }
        return matchOTP !== null;
      }

      async findById(userID:string): Promise<User | null> {
        const user = await userModel.findOne({ _id:userID });
        if (!user) return null;
        return user
      }
}


 