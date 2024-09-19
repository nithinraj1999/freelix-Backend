import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import userModel from "../models/userModel";
import Otp from "../models/otpModel";
export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await userModel.findOne({ email });
        if (!user) return null;
        return user
    }

    async save(user: User): Promise<User> {
        const newUser = new userModel({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            profilePicture: user.profilePicture,
        });
        const savedData = await newUser.save();
        return savedData
    }

    async saveUserOtp(userId:string,otp:string):Promise<void>{
        const newOtp = new Otp({
            userID:userId,
            otp:otp
        })
        await newOtp.save()
    }
}
 