import { IBidUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IBidUseCase'
import { IBidRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IBidRepository'

export class BidUseCase implements IBidUseCase {
    private bidRepository: IBidRepository

    constructor(bidRepository: IBidRepository) {
        this.bidRepository = bidRepository
    }

    async fetchAllBids(jobId: string) {
        try {
            const bids = await this.bidRepository.allBids(jobId)
            return bids
        } catch (error) {
            console.error(error)
        }
    }
}
