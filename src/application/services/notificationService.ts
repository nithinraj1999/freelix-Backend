import { io } from "../../index"; // Import the io instance
import { User as UserEntity } from "../../domain/entities/user"; 

export class NotificationService {
    static sendJobPostNotification(freelancers: UserEntity[], jobData: any) {
        console.log("notiService......", freelancers);
       
        freelancers.forEach((freelancer) => {
            console.log(freelancer.socketId);
            
            if (freelancer.socketId) { // Ensure socketId exists before sending
                io.to(freelancer.socketId).emit('newJobNotification', { // Emit only to the specific socket
                    userId: freelancer._id,
                    jobId: jobData._id,
                    jobTitle: jobData.title,
                    createdAt: new Date(),
                });
            }
        });
    }
}
