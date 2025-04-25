import { userSocketMap } from "../../services/socket";
import { IFreelancerBidRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerBidRepository";
import { IFreelancerNotificationRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerNotificationRepository";
import { NotificationService } from "../../services/notificationService";
import { IBid } from "../../../infrastructure/models/interface/IBidModel";
import { IFreelancerBidUseCase } from "../../../domain/interfaces/freelancer/useCases/IFreelancerBidUseCase";

export class FreelancerBidUseCase implements IFreelancerBidUseCase{
    constructor(private readonly freelancerBidRepository: IFreelancerBidRepository,private readonly notificationRepository:IFreelancerNotificationRepository) {}
    async isBidderAlreadyExist(jobId: string, userId: string) {
      return this.freelancerBidRepository.isExistingBidder(jobId, userId);
    }
  
    async submitBid(jobId: string, freelancerId: string, bidAmount: string, deliveryDays: string, proposal: string) {
      const bid = await this.freelancerBidRepository.submitBid(jobId, freelancerId, bidAmount, deliveryDays, proposal);
  
      await this.notificationRepository.storeNotification(bid.jobId.userID, bid.freelancerId, bid.freelancerId.name, bid.createdAt, bid.bidAmount);
  
      const clientSocketID = userSocketMap.get(bid.jobId.userID.toString());
      if (clientSocketID) {
        await NotificationService.sendNewBidDetails(clientSocketID, bid);
        await NotificationService.sendNotification(clientSocketID, bid);
      }
  
      return bid;
    }
  
    async getAllBids(jobId: string) {
      return this.freelancerBidRepository.getAllBids(jobId);
    }
  
    async editBid(data: Partial<IBid>) {
      return this.freelancerBidRepository.editBid(data);
    }
  
    async myBids(userId: string) {
      return this.freelancerBidRepository.myBids(userId);
    }
  
    async myBidDetails(bidID: string) {
      return this.freelancerBidRepository.myBidDetails(bidID);
    }
  
    async withdrawBid(bidId: string) {
      const withdraw = await this.freelancerBidRepository.withdrawBid(bidId);
      const clientSocketID = userSocketMap.get(withdraw.jobId.userID.toString());
      if (clientSocketID) {
        await NotificationService.removeBid(clientSocketID, bidId);
      }
      return withdraw;
    }
  }
  