export interface INotificationRepository{
    fetchAllNotifications(userID: string):Promise<any>
}