import { IBidRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IBidRepository"

export class BidRepository implements IBidRepository{
    private BidModel
    constructor(BidModel:any){
        this.BidModel = BidModel
    }

    async allBids(jobId: string) {
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