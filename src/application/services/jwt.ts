import 'dotenv/config';
import { jwtInterface } from "./interfaces/jwtInterface";
import jwt from "jsonwebtoken";


export class JWT implements jwtInterface {
    private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'defaultSecret';  // Load from env
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: '30d' }); // Token expires in 1 hour
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}
 