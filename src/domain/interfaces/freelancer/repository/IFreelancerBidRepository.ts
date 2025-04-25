import { IBid } from '../../../../infrastructure/models/interface/IBidModel'

export interface IFreelancerBidRepository {
    isExistingBidder(jobId: string, userId: string): Promise<any>
    submitBid(jobId: string,freelancerId: string,bidAmount: string,deliveryDays: string,proposal: string): Promise<any>
    getAllBids(jobId: string): Promise<any>
    editBid(data: Partial<IBid>): Promise<any>
    myBids(userId: string): Promise<any>
    myBidDetails(bidID: string): Promise<any>
    withdrawBid(bidId: string): Promise<any>
}
