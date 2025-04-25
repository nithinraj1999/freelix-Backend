import { Request, Response, NextFunction } from 'express'
import { INotificationUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/INotificationUseCase';

export class NotificationController{
    
    private notificationUseCase:INotificationUseCase
    constructor(notificationUseCase:INotificationUseCase){
        this.notificationUseCase =notificationUseCase
    }


    
  async fetchAllNotifications(req:Request,res:Response,next:NextFunction){
    try{
      
     const {userID} = req.body
     const notifications = await this.notificationUseCase.fetchAllNotifications(userID);

   res.status(200).json({success:true,notifications:notifications})
   }catch(error){
     console.error(error);
     res.status(500).json({success:false})
   }
  }
}