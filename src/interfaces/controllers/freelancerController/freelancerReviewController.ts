import { Request, Response } from 'express'
import { IFreelancerReviewUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerReviewUseCase'

export class FreelancerReviewController {
constructor(private readonly freelancerReviewUseCase:IFreelancerReviewUseCase){}
    async fetchReviews(req: Request, res: Response) {
        try {
            const { freelancerId } = req.body
            const allReviews = await this.freelancerReviewUseCase.fetchReviews(
                freelancerId
            )
            res.json({ success: true, allReviews: allReviews })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: 'An error occurred .',
            })
        }
    }

  }
  