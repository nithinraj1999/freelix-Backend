import { IUserRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IUserRepository"
import { User } from "../../../domain/entities/user"
import { Model } from "mongoose"; 
import { IUserDocument } from "../../models/userModel";
export class UserRepo implements IUserRepository {
    private userModel: Model<any>; 
    private otpModel: Model<any>; 

    constructor(userModel:Model<any>,otpModel:Model<any>){
        this.userModel =userModel
        this.otpModel =otpModel

    }
    async checkEmailExist(email: string): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({
                email: email,
                isAdmin: false,
                isBlock: false,
            })
            if (!user) return null
            return user
        } catch (error) {
            throw error
        }
    }
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({
                email: email,
                isAdmin: false,
                isBlock: false,
                isVerified: true,
            })
            if (!user) return null
            return user
        } catch (error) {
            throw error
        }
    }

    async save(user: User): Promise<User> {
        const newUser = this.userModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            isVerified: true,
        })
        return newUser
    }
    async saveUserOtp(otp: string, email: string, userDta: any): Promise<any> {
        const otpExpirationTime = 120000
        const newOtp = new this.otpModel({
            otp: otp,
            email: email,
            userData: {
                name: userDta.name,
                email: userDta.email,
                password: userDta.password,
                phone: userDta.phone,
            },
            createdAt: Date.now(),
        })
        const otpDoc = await newOtp.save()
        setTimeout(async () => {
            await this.otpModel.updateOne({ email: email }, { $set: { otp: null } })
        }, otpExpirationTime)
        return otpDoc
    }
}