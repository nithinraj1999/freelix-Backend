export interface IFreelancerReviewRepository{
    fetchReviews(freelancerId: string):Promise<any>
}