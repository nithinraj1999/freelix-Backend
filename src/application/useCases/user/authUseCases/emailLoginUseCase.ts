import { ILoginUseCase } from "../../../../domain/interfaces/user/useCaseInterfaces/ILoginUseCase";
import { IUserRepository } from "../../../../domain/interfaces/user/repositoryInterfaces/IUserRepository";
import { Ibcrypt } from "../../../services/interfaces/bcryptInterface";
import { User } from "../../../../domain/entities/user";

export class EmailLoginUseCase implements ILoginUseCase {
    
    private userRepository:IUserRepository;
    private bcrypt: Ibcrypt;

    constructor(userRepository:IUserRepository,bcrypt: Ibcrypt,) {
        this.userRepository = userRepository;
        this.bcrypt = bcrypt;
    }
  
    async login(credentials:{email: string, password: string}): Promise<User|null> {
        try {
            const user = await this.userRepository.findByEmail(credentials.email);
            if (user && user.password) {
            const isPasswordValid = await this.bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
                return user;
                }
            }
            return null; 
          } catch (error) {
            console.error(error);
            throw error
          }
    }

    
    async logout(): Promise<void> {
      }
  }
  