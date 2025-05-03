import { Bid } from "../../../entities/bid"
export interface IFreelancerBidUseCase{
    isBidderAlreadyExist(jobId: string, userId: string):Promise<any>
    submitBid(jobId: string, freelancerId: string, bidAmount: string, deliveryDays: string, proposal: string):Promise<any>
    getAllBids(jobId: string):Promise<any>
    editBid(data: Partial<Bid>):Promise<any>
    myBids(userId: string):Promise<any>
    myBidDetails(bidID: string):Promise<any>
    withdrawBid(bidId: string):Promise<any>
}