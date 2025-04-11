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
exports.SignupController = void 0;
class SignupController {
    constructor(signupUseCase) {
        this.signupUseCase = signupUseCase;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword } = req.body;
                if (password !== confirmPassword) {
                    res.json({ message: 'password is not matching' });
                }
                else {
                    const user = yield this.signupUseCase.registerUser(req.body);
                    res.status(201).json({
                        success: true,
                        userID: user,
                        email: req.body.email,
                        message: 'User registration successful. Please verify the OTP sent to your email.',
                    });
                }
            }
            catch (err) {
                res.json({ success: false, message: 'Email already exist' });
            }
        });
    }
}
exports.SignupController = SignupController;
