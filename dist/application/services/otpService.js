"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
class OtpService {
    // Generate a random OTP and return it as a Promise
    generateOtp(length = 5) {
        return new Promise((resolve) => {
            const otp = otp_generator_1.default.generate(length, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true
            });
            resolve(otp);
        });
    }
    // Validate the OTP 
    validateOtp(userOtp, generatedOtp) {
        return new Promise((resolve) => {
            resolve(userOtp === generatedOtp);
        });
    }
}
exports.OtpService = OtpService;
