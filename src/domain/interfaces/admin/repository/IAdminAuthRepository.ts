import { User } from "../../../entities/user"
export interface IAdminAuthRepository {
    findByEmail(email: string): Promise<User | null>
  }
  