import { IFreelancerNotificationRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerNotificationRepository"


export class FreelancerNotificationRepository implements IFreelancerNotificationRepository{
    private notificationModel: any
    constructor(notificationModel: any) {
        this.notificationModel = notificationModel
    }
    async storeNotification(
        userID: string,
        freelancerId: string,
        freelancerName: string,
        createdAt: string,
        bidAmount: string
    ) {
        try {
            const newNotification = this.notificationModel.create({
                userID: userID,
                freelancerId: freelancerId,
                freelancerName: freelancerName,
                bidAmount: bidAmount,
                createdAt: createdAt,
            })
            return newNotification
        } catch (error) {
            throw error
        }
    }
}
