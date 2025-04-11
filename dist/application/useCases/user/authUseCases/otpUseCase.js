"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPUsecases = void 0;
class OTPUsecases {
    constructor(userRepository, OTPRepository, jwt, otpService, emailService) {
        this.userRepository = userRepository;
        this.OTPRepository = OTPRepository;
        this.jwt = jwt;
        this.otpService = otpService;
        this.emailService = emailService;
    }
    verification(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findOTP = yield this.OTPRepository.findOTP(otp, email);
                if (findOTP) {
                    const savedData = yield this.userRepository.save(findOTP.userData);
                    const token = this.jwt.generateAccessToken({
                        email: email,
                    });
                    return { findOTP, token };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield this.otpService.generateOtp();
                const response = yield this.OTPRepository.updateUserOtp(otp, email);
                yield this.emailService.sendEmail(response.email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OTPUsecases = OTPUsecases;
