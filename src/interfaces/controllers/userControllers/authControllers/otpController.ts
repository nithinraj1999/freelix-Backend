import { Request, Response,NextFunction } from 'express'
import { IOTPUseCase } from "../../../../domain/interfaces/user/useCaseInterfaces/IOTPUseCase";

export class OTPController  {
    private OTPUseCase:IOTPUseCase;

    constructor(OTPUseCase:IOTPUseCase){
        this.OTPUseCase = OTPUseCase
    }
    async verification(req: Request, res: Response,next:NextFunction) {
        try {
            const { otp, email } = req.body;
            const verify = await this.OTPUseCase.verification(otp, email);
            if (verify) {
                res.status(201).json({ success: true, message: "otp verified." });
            }else{
              res.json({ success: false, message: "otp not verified." });
            }
        } catch (error) {
            // res.status(500).json({ success: false, message: "otp not verified." });
            console.log(error);
            
        }
}
}