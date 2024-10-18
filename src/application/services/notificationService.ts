// src/application/services/notificationService.ts

import { io } from "../../index"; // Import the io instance
import { User as UserEntity } from "../../domain/entities/user"; 
export class NotificationService {
    static sendJobPostNotification(freelancers: UserEntity[], jobData: any) {
        freelancers.forEach((freelancer) => {
            io.emit('newJobNotification', {
                userId: freelancer._id,
                jobId: jobData._id,
                jobTitle: jobData.title,
                createdAt: new Date(),
            }); 
        });
    }
}
