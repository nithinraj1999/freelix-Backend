import { IUserRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IUserRepository"
import { User } from "../../../domain/entities/user"
import { Model } from "mongoose"; 

export class UserRepo implements IUserRepository {
    private userModel: Model<any>; 

    constructor(userModel:Model<any>){
        this.userModel =userModel
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

    async findById(userID: string): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({ _id: userID })
            if (!user) return null
            return user
        } catch (error) {
            throw error
        }
    }

    async updatePassword(userId: string, password: string) {
        try {
            const updated = await this.userModel.updateOne(
                { _id: userId },
                { $set: { password: password } }
            )
            return updated
        } catch (error) {
            throw error
        }
    }

    async editData(profilePicture:string,name:string,email:string,userId:string) {
        try {
            const data: any = {}
            if (profilePicture) {
                data.profilePicture = profilePicture
            }
            if (name) {
                data.name = name
            }
            if (email) {
                data.email = email
            }
            const userData = await this.userModel.findOneAndUpdate(
                { _id: userId },
                { $set: data },
                {new:true}
            )
            return userData
        } catch (error) {
            throw error
        }
    }
}