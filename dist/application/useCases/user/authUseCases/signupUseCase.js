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
exports.SignupUseCase = void 0;
class SignupUseCase {
    constructor(userRepository, bcrypt, emailService, otpService, OTPRepository) {
        this.userRepository = userRepository;
        this.OTPRepository = OTPRepository;
        this.bcrypt = bcrypt;
        this.emailService = emailService;
        this.otpService = otpService;
    }
    registerUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.findByEmail(data.email);
                if (existingUser) {
                    throw new Error('User with this email already exists.');
                }
                else {
                    if (data.password) {
                        data.password = yield this.bcrypt.hash(data.password);
                    }
                    const otp = yield this.otpService.generateOtp();
                    yield this.OTPRepository.saveUserOtp(otp, data.email, data);
                    yield this.emailService.sendEmail(data.email, otp);
                    return;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.SignupUseCase = SignupUseCase;
