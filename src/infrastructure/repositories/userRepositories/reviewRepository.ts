import { IReviewRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IReviewRepository"

export class ReviewRepository implements IReviewRepository{

    private reviewModel
    constructor(reviewModel:any){
        this.reviewModel = reviewModel
    }

    async submitReview(clientId:string,freelancerId:string,review:string,rating: string) {
        try {
            const reviewDoc = await this.reviewModel.create({
                clientId: clientId,
                freelancerId: freelancerId,
                rating: rating,
                comment: review,
            })
            return reviewDoc
        } catch (error) {
            throw error
        }
    }

}