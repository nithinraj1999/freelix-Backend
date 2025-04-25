import { User } from "../../../entities/user";
export interface ILoginUseCase {
    login(credentials: any): Promise<User |null>;
    logout(): Promise<void>;
}
  