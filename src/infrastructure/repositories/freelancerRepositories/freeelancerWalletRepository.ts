import { IFreelancerWalletRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerWalletRepo'

export class FreelancerWalletRepository implements IFreelancerWalletRepository {
    private walletModel: any

    constructor(walletModel: any) {
        this.walletModel = walletModel
    }

    async fetchWallet(freelancerId: string) {
        try {
            const wallet = await this.walletModel.findOne({
                userId: freelancerId,
            })
            return wallet
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
