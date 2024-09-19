import otpGenerator from 'otp-generator';
import { IOtpService } from './interfaces/IOtpService'; // Adjust path as necessary

export class OtpService implements IOtpService {
    // Generate a random OTP and return it as a Promise
    generateOtp(length = 5): Promise<string> {
        return new Promise((resolve) => {
            const otp = otpGenerator.generate(length, {
                upperCaseAlphabets: false,  
                lowerCaseAlphabets: false, 
                specialChars: false,       
                digits: true                
            });
            resolve(otp);
        });
    }

    // Validate the OTP 
    validateOtp(userOtp: string, generatedOtp: string): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(userOtp === generatedOtp);
        });
    }
}
