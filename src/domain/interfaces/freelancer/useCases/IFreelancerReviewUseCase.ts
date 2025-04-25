export interface IFreelancerReviewUseCase{
    fetchReviews(freelancerId: string):Promise<any>
}