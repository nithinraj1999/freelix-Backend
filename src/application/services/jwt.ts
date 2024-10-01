
import 'dotenv/config';
import { jwtInterface } from "./interfaces/jwtInterface";
import jwt from "jsonwebtoken";

export class JWT implements jwtInterface {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret';  // Access Token Secret
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret';  // Refresh Token Secret
  }

  // Generate Access Token (short-lived)
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '2s' }); 
  }

  // Generate Refresh Token (long-lived)
  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '10s' }); // Refresh Token expires in 7 days
  }

  // Verify Access Token
  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (err) {
      throw new Error('Invalid or expired access token');
    }
  }

  // Verify Refresh Token
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
