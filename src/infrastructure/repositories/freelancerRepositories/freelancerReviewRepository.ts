import { IFreelancerReviewRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerReviewRepository'

export class FreelancerReviewRepository implements IFreelancerReviewRepository {
    private reviewModel: any
    
    constructor(reviewModel: any) {
        this.reviewModel = reviewModel
    }

    async fetchReviews(freelancerId: string) {
        try {
            const reviews = await this.reviewModel
                .find({
                    freelancerId: freelancerId,
                })
                .populate({
                    path: 'clientId',
                    select: 'name profilePicture',
                })
            return reviews
        } catch (error) {
            throw error
        }
    }
}
