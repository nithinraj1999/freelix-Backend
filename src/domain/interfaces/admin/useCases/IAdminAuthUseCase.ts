export interface IAdminAuthUseCase {
    authenticateAdmin(email: string, password: string): Promise<any>;
  }
  