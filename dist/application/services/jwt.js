"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWT {
    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret'; // Access Token Secret
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret'; // Refresh Token Secret
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.accessTokenSecret, { expiresIn: '10d' });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.refreshTokenSecret, { expiresIn: '20d' }); // Refresh Token expires in 7 days
    }
    verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.accessTokenSecret);
        }
        catch (err) {
            throw new Error('Invalid or expired access token');
        }
    }
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.refreshTokenSecret);
        }
        catch (err) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}
exports.JWT = JWT;
