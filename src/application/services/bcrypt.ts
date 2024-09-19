import bcrypt from "bcryptjs";
import { Ibcrypt } from "./interfaces/bcryptInterface";

export class BcryptPasswordHasher implements Ibcrypt {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw error;
    }
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}
