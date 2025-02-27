import { Request, Response, NextFunction } from 'express'
import { IBidUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IBidUseCase'

export class BidController {
    private bidUseCase: IBidUseCase
    constructor(bidUseCase: IBidUseCase) {
        this.bidUseCase = bidUseCase
    }

    async fetchAllBids(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.body
            const bids = await this.bidUseCase.fetchAllBids(jobId)
            res.json({ success: true, bids: bids })
        } catch (error) {
            console.error(error)
            res.json({ success: false })
        }
    }
}
