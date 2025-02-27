import { INotificationRepository } from "../../../../domain/interfaces/user/repositoryInterfaces/INotificationRepository"

export class NotificationUseCase{
    private notificationRepository:INotificationRepository
    constructor(notificationRepository:INotificationRepository){
        this.notificationRepository =notificationRepository
    }

    async fetchAllNotifications(userID:string){
        try{
          const notifications = await this.notificationRepository.fetchAllNotifications(userID)
          return notifications
        }catch(error){
          throw error
        }
      }
}