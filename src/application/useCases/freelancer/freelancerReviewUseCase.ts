import { IFreelancerReviewRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerReviewRepository";

export class FreelancerReviewUseCase {
    constructor(private readonly freelancerReviewRepository: IFreelancerReviewRepository) {}
    async fetchReviews(freelancerId: string) {
      return this.freelancerReviewRepository.fetchReviews(freelancerId);
    }
  }
  