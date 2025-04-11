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
exports.OTPRepository = void 0;
class OTPRepository {
    constructor(otpModel) {
        this.otpModel = otpModel;
    }
    saveUserOtp(otp, email, userDta) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpExpirationTime = 120000;
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
            });
            const otpDoc = yield newOtp.save();
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield this.otpModel.updateOne({ email: email }, { $set: { otp: null } });
            }), otpExpirationTime);
            return otpDoc;
        });
    }
    updateUserOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOtp = yield this.otpModel.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
            return newOtp;
        });
    }
    findOTP(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchOTP = yield this.otpModel.findOne({ email: email, otp: otp });
            return matchOTP;
        });
    }
}
exports.OTPRepository = OTPRepository;
