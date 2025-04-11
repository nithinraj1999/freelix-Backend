import { IBid } from '../../models/interface/IBidModel'
import { IFreelancerBidRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerBidRepository'

export class FreelancerBidRepository implements IFreelancerBidRepository{

    private bidModel: any
    constructor(bidModel: any) {
        this.bidModel = bidModel
    }
    async isExistingBidder(jobId: string, userId: string) {
        try {
            const isExistingBidder = await this.bidModel.findOne({
                jobId: jobId,
                freelancerId: userId,
                status: { $ne: 'Withdrawn' },
            })
            return isExistingBidder
        } catch (error) {
            throw error
        }
    }

    async submitBid(
        jobId: string,
        freelancerId: string,
        bidAmount: string,
        deliveryDays: string,
        proposal: string
    ) {
        try {
            const bid = new this.bidModel({
                jobId: jobId,
                freelancerId: freelancerId,
                bidAmount: bidAmount,
                deliveryDays: deliveryDays,
                proposal: proposal,
            })
            await bid.save()
            const populatedBid = await this.bidModel
                .findById(bid._id)
                .populate('jobId')
                .populate('freelancerId')
            return populatedBid
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getAllBids(jobId: string) {
        try {
            const allBids = await this.bidModel
                .find({
                    jobId: jobId,
                    status: { $ne: 'withdrawn' },
                })
                .populate('freelancerId')
                .sort({ createdAt: -1 })
            return allBids
        } catch (error) {
            throw error
        }
    }

    async editBid(data: Partial<IBid>) {
        try {
            const { _id, bidAmount, deliveryDays, proposal } = data
            const dataToUpdate: Partial<IBid> = {}
            if (bidAmount) {
                dataToUpdate.bidAmount = bidAmount
            }
            if (deliveryDays) {
                dataToUpdate.deliveryDays = deliveryDays
            }
            if (proposal) {
                dataToUpdate.proposal = proposal
            }

            const editBid = await this.bidModel
                .findOneAndUpdate(
                    { _id: _id },
                    { $set: dataToUpdate },
                    { new: true }
                )
                .populate('freelancerId')

            return editBid
        } catch (error) {
            throw error
        }
    }

    async myBids(userId: string) {
        try {
            const allMyBids = await this.bidModel
                .find(
                    { freelancerId: userId },
                    { createdAt: 1, bidAmount: 1, _id: 1, status: 1 }
                )
                .populate('jobId', 'title')
                .sort({ createdAt: -1 })
            return allMyBids
        } catch (error) {
            throw error
        }
    }

    async myBidDetails(bidID: string) {
        try {
            const myBidDetails = await this.bidModel
                .findOne({
                    _id: bidID,
                })
                .populate('jobId')
            return myBidDetails
        } catch (error) {
            throw error
        }
    }

    async withdrawBid(bidId: string) {
        try {
            const withdraw = await this.bidModel
                .findOneAndUpdate(
                    { _id: bidId },
                    { $set: { status: 'Withdrawn' } },
                    { new: true }
                )
                .populate('jobId')
            return withdraw
        } catch (error) {
            throw error
        }
    }
}
