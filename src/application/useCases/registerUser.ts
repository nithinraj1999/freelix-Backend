// application/usecases/registerUser.ts

import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { User } from "../../domain/entities/user";
import { RegisterUserDto } from "../dtos/registerUserDto";

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: RegisterUserDto): Promise<void> {
    const { id,name, email, password, role = "client" } = request;

    // Check if the email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // Create new user
    const user = new User(id,name, email, password, role);

    // Save the user
    await this.userRepository.save(user);
  }
}
