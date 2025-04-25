export interface INotificationUseCase{
    fetchAllNotifications(userID:string):Promise<any>
}