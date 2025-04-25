export interface IReviewUseCase{
    submitReview(clientId:string,freelancerId:string,review:string,rating:string):Promise<any>
}