import { IFreelancerOrderRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerOrderRepository";
import { S3Bucket } from '../../services/s3bucket'
import { IFreelancerOrderUseCase } from "../../../domain/interfaces/freelancer/useCases/IFreelancerOrderUseCase";

export class FreelancerOrderUseCase implements IFreelancerOrderUseCase{
    constructor(private readonly freelancerOrderRepository: IFreelancerOrderRepository) {}
  
    async getMyOrders(freelancerId: string) {
      return this.freelancerOrderRepository.getMyOrders(freelancerId);
    }
  
    async completeOrder(orderId: string, description: string, file: any) {
      let image = null;
      if (file) {
        const { originalname, buffer, mimetype } = file;
        const awsS3 = new S3Bucket();
        image = await awsS3.uploadProfilePic(originalname, buffer, mimetype, 'project-files');
      }
      return this.freelancerOrderRepository.completeOrder(orderId, description, image);
    }
  }
  