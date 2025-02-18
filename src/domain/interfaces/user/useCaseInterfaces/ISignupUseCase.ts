import { User } from "../../../entities/user";
export interface ISignupUseCase{
    registerUser(data: User): Promise<void>;
}