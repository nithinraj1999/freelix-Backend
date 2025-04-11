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
exports.LoginController = void 0;
class LoginController {
    constructor(emailLoginUseCase, jwt) {
        this.emailLoginUseCase = emailLoginUseCase;
        this.jwt = jwt;
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = req.body;
                const user = yield this.emailLoginUseCase.login(credentials);
                if (!user) {
                    return res
                        .status(404)
                        .json({ success: false, message: "User not found" });
                }
                else {
                }
                const accessToken = yield this.jwt.generateAccessToken({
                    _id: user._id,
                    role: user.role,
                });
                const refreshToken = yield this.jwt.generateRefreshToken({
                    _id: user._id,
                    role: user.role,
                });
                res.cookie("userRefreshJWT", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        hasFreelancerAccount: user.hasFreelancerAccount,
                        profilePicture: user.profilePicture,
                        isBlock: user.isBlock,
                        isVerified: user.isVerified,
                        description: user.description,
                        skills: user.skills,
                        languages: user.languages,
                        isFreelancerBlock: user.isFreelancerBlock,
                    },
                    message: "Login successfull",
                    accessToken: accessToken,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Login failed" });
            }
        });
    }
}
exports.LoginController = LoginController;
