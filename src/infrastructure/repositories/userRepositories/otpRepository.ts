import { IOTPRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IOTPRepository";


export class OTPRepository implements IOTPRepository{
    private otpModel

    constructor(otpModel:any){
        this.otpModel = otpModel
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


    async updateUserOtp(otp: string, email: string): Promise<any> {
        const newOtp = await this.otpModel.findOneAndUpdate(
            { email: email },
            { $set: { otp: otp } }
        )
        return newOtp
    }

    async findOTP(otp: string, email: string) {
        const matchOTP = await this.otpModel.findOne({ email: email, otp: otp })
        return matchOTP
    }
}