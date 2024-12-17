
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

  generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '10d' }); 
  }
 
  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '20d' }); // Refresh Token expires in 7 days
  }

  
  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (err) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  }


}
