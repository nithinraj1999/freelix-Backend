export interface IFreelancerNotificationRepository{
    storeNotification(
        userID: string,
        freelancerId: string,
        freelancerName: string,
        createdAt: string,
        bidAmount: string
    ):Promise<any>
}