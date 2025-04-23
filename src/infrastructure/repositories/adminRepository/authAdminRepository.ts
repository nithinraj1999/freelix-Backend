import userModel from "../../models/userModel";
import { User } from "../../../domain/entities/user";
import { IAdminAuthRepository } from "../../../domain/interfaces/admin/repository/IAdminAuthRepository";
export class AuthAdminRepository implements IAdminAuthRepository{
  async findByEmail(email: string): Promise<User | null> {
    return await userModel.findOne({ email, isAdmin: true });
  }
}
