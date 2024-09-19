import { User } from "../../../domain/entities/user";

export interface IUserUseCase{
    registerUser(data: User): Promise<void>;
}