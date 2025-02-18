import { User } from "../../../entities/user";

export interface IUserRepository {
  save(user: User): Promise<User>;
  checkEmailExist(email: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(userID: string): Promise<User | null>
  updatePassword(userId: string, password: string):Promise<any>
}