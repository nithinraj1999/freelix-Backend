import { IReviewRepository } from "../../../../domain/interfaces/user/repositoryInterfaces/IReviewRepository";
import { IReviewUseCase } from "../../../../domain/interfaces/user/useCaseInterfaces/IReviewUseCase";
export class ReviewUseCase implements IReviewUseCase{
    private reviewRepository:IReviewRepository
    constructor(reviewRepository:IReviewRepository){
        this.reviewRepository = reviewRepository
    }


    
async submitReview(clientId:string,freelancerId:string,review:string,rating:string){
    try{
      const releadPayment = await this.reviewRepository.submitReview(clientId,freelancerId,review,rating);
      return releadPayment
    }catch(error){
      
      console.error(error);
      throw error
    }
  }
}