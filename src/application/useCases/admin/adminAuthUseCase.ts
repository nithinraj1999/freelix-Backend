import { IAdminAuthRepository } from "../../../domain/interfaces/admin/repository/IAdminAuthRepository"
import { Ibcrypt } from "../../../domain/interfaces/serviceInterfaces/bcryptInterface"

export class AdminAuthUseCase {
    constructor(
      private adminAuthRepository: IAdminAuthRepository,
      private bcrypt: Ibcrypt,
    ) {}
  
    async authenticateAdmin(email: string, password: string) {
      const user = await this.adminAuthRepository.findByEmail(email)
      if (!user || !user.password) return null
  
      const isValid = await this.bcrypt.compare(password, user.password)
      return isValid ? user : null
    }
  }
  