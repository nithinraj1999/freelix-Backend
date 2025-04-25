import { IFreelancerWalletRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerWalletRepo";
import { IFreelancerWalletUseCase } from "../../../domain/interfaces/freelancer/useCases/IFreelancerWalletUseCase";

export class FreelancerWalletUseCase implements IFreelancerWalletUseCase {
    constructor(private readonly freelancerWalletRepository: IFreelancerWalletRepository) {}
    async fetchWallet(freelancerId: string) {
      return this.freelancerWalletRepository.fetchWallet(freelancerId);
    }
  }
  