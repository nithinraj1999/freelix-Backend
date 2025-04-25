import { Request, Response } from 'express'
import { IFreelancerBidUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerBidUseCase'
export class FreelancerBidController {
  constructor(private freelancerBidUseCase: IFreelancerBidUseCase) {}

  async isExistingBidder(req: Request, res: Response) {
    try {
      const { jobId, userId } = req.body
      const isExist = await this.freelancerBidUseCase.isBidderAlreadyExist(jobId, userId)
      res.json({ isExist })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async submitBid(req: Request, res: Response) {
    try {
      const { jobId, freelancerId, bidAmount, deliveryDays, proposal } = req.body
      const isExist = await this.freelancerBidUseCase.isBidderAlreadyExist(jobId, freelancerId)
      if (isExist) {
        return res.json({ success: false, message: 'already bidded' })
      }
      const bid = await this.freelancerBidUseCase.submitBid(jobId, freelancerId, bidAmount, deliveryDays, proposal)
      res.status(200).json({ success: true, bid })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async getAllBids(req: Request, res: Response) {
    try {
      const { jobId } = req.body
      const allBids = await this.freelancerBidUseCase.getAllBids(jobId)
      res.status(200).json({ success: true, allBids })
    } catch (error) {
      res.status(500).json({ success: false })
      console.error(error)
    }
  }

  async editMyBid(req: Request, res: Response) {
    try {
      const data = req.body
      const bidEdit = await this.freelancerBidUseCase.editBid(data)
      res.status(200).json({ success: true, editedBid: bidEdit })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async myBids(req: Request, res: Response) {
    try {
      const { userId } = req.body
      const myBids = await this.freelancerBidUseCase.myBids(userId)
      res.status(200).json({ success: true, myBids })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async myBidDetails(req: Request, res: Response) {
    try {
      const { bidID } = req.body
      const myBidDetails = await this.freelancerBidUseCase.myBidDetails(bidID)
      res.status(200).json({ success: true, myBidDetails })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async withdrawBid(req: Request, res: Response) {
    try {
      const { bidId } = req.body
      await this.freelancerBidUseCase.withdrawBid(bidId)
      res.status(200).json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }
}
