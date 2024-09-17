import { IUser } from "../entities/user";

export interface IUserRepository {
  save(user: IUser): Promise<void>;
  findByEmail(email: string): Promise<IUser | null>;
}
