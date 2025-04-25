import { INotificationRepository } from "../../../domain/interfaces/user/repositoryInterfaces/INotificationRepository"

export class NotificationRepository implements INotificationRepository {

    private notificationModel: any

    constructor(notificationModel: any) {
        this.notificationModel = notificationModel
    }

    async fetchAllNotifications(userID: string) {
        try {
            const notifications = await this.notificationModel.find({
                userID: userID,
            })
            return notifications
        } catch (error) {
            throw error
        }
    }
}
