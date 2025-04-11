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
exports.OTPController = void 0;
class OTPController {
    constructor(OTPUseCase) {
        this.OTPUseCase = OTPUseCase;
    }
    verification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                const verify = yield this.OTPUseCase.verification(otp, email);
                if (verify) {
                    res.status(201).json({ success: true, message: "otp verified." });
                }
                else {
                    res.json({ success: false, message: "otp not verified." });
                }
            }
            catch (error) {
                // res.status(500).json({ success: false, message: "otp not verified." });
                console.log(error);
            }
        });
    }
}
exports.OTPController = OTPController;
