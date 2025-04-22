import { Request, Response, NextFunction } from 'express'
import { IReviewUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IReviewUseCase'

export class ReviewController {
    private reviewUseCase:IReviewUseCase
    
    constructor(reviewUseCase:IReviewUseCase) {
        this.reviewUseCase = reviewUseCase
    }

    async submitReview(req: Request, res: Response, next: NextFunction) {
        try {
            const { clientId, freelancerId, review, rating } = req.body
            const submission = await this.reviewUseCase.submitReview(
                clientId,
                freelancerId,
                review,
                rating
            )
            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }
}
