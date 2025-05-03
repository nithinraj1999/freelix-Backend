import { IBidRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IBidRepository"
import { Bid } from "../../../domain/entities/bid"
import { User } from "../../../domain/entities/user"
export class BidRepository implements IBidRepository{
    private BidModel
    constructor(BidModel:any){
        this.BidModel = BidModel
    }

    async allBids(jobId: string): Promise<(Bid & { freelancerId: User })[]> {
        try {
            const allBids = await this.BidModel.find({
                jobId: jobId,
                status: { $ne: 'Withdrawn' },
            })
                .populate('freelancerId')
                .sort({ createdAt: -1 })
            return allBids
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}