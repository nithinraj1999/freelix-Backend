import { IUserRepository } from "../../../domain/ports/userRepositoryInterface";
import { User } from "../../../domain/entities/user";
import { RegisterUserDto } from "../../dtos/registerUserDto";
import { Ibcrypt } from "../../services/interfaces/bcryptInterface";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: Ibcrypt
  ) {}

  async execute(request: RegisterUserDto): Promise<void> {
    const { name, email, password, role = "client" } = request;

    // Hash the password using the provided hasher
    const hashedPassword = await this.passwordHasher.hash(password);

    // Check if the email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // Create new user with hashed password
    const user: User = {
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture: request.profilePicture, // If `profilePicture` is included in DTO
    };

    // Save the user
    await this.userRepository.save(user);
  }
}
 