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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() { }
    sendEmail(recipient, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });
            let mailOptions = {
                from: process.env.MAIL_USER,
                to: recipient,
                subject: "Your OTP Code",
                text: `Your OTP code is: ${message}`,
            };
            try {
                let info = yield transporter.sendMail(mailOptions);
                return info;
            }
            catch (error) {
                throw error;
            }
        });
    }
    sendEmailToResetPassword(email, resetLink) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });
            // HTML-formatted email
            let mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: "Your Reset Password Link",
                html: `
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" target="_blank" style="color: #1d4ed8; text-decoration: none;">Reset Password</a>
        `,
            };
            try {
                let info = yield transporter.sendMail(mailOptions);
                return info;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.EmailService = EmailService;
