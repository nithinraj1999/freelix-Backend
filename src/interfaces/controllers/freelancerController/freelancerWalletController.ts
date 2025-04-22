import { Request, Response } from 'express'
import { IFreelancerWalletUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerWalletUseCase'

export class FreelancerWalletController {
    constructor(private readonly freelancerWalletUseCase:IFreelancerWalletUseCase){}
    async fetchWallet(req: Request, res: Response) {
        try {
            const { freelancerId } = req.body
            const wallet = await this.freelancerWalletUseCase.fetchWallet(
                freelancerId
            )
            console.log(wallet)

            res.json({ success: true, wallet: wallet })
        } catch (error) {
            console.error(error)
        }
    }
  }
  