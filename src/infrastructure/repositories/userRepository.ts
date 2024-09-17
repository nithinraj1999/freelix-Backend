import { IUserRepository } from "../../domain/ports/userRepositoryInterface";

import { User } from "../../domain/entities/user";
import UserModel from "../models/userModel";



export class UserRepository implements IUserRepository{
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;

        return new User(user.id, user.name, user.email,user.password);
      }
    
      async save(user: User): Promise<void> {
        const newUser = new UserModel({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
        await newUser.save();
      }


}