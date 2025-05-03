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

    async editData(profilePicture:string,name:string,email:string,userId:string):Promise<User> {
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
        async getUserData(userId: string):Promise<User> {
            try {
                const userData = await this.userModel.findOne(
                    { _id: userId },
                    { name: 1, email: 1, phone: 1, profilePicture: 1 }
                )
                return userData
            } catch (error) {
                throw error
            }
        }
    
    async getFreelancerDetails(freelancerId: string):Promise<User> {
            try {
                const details = await this.userModel.findOne({ _id: freelancerId })
                return details
            } catch (error) {
                throw error
            }
        }

            async getAllFreelancers(): Promise<Pick<User, '_id'>[]> 
             {
                try {
                    const freelancer = await this.userModel
                        .find({ hasFreelancerAccount: true }, { _id: 1 })
                        .lean()
                    return freelancer as Pick<User, '_id'>[];
                } catch (error) {
                    console.error(error)
                    throw error
                }
            }
        
}