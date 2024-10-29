import { io } from "../../index"; // Import the io instance
import { User as UserEntity } from "../../domain/entities/user"; 
import { IBid } from "../../domain/entities/bid";
export class NotificationService {
    static sendJobPostNotification(freelancers: UserEntity[], jobData: any) {
        console.log("notiService......", freelancers);
        freelancers.forEach((freelancer) => {
            console.log(freelancer.socketId);
            
            if (freelancer.socketId) { 
                io.to(freelancer.socketId).emit('newJobNotification', { // Emit only to the specific socket
                    userId: freelancer._id,
                    jobId: jobData._id,
                    jobTitle: jobData.title,
                    createdAt: new Date(),
                });
            }
        });
    }

     static sendNewBidDetails(clientSocketID:string,bidDetails:IBid){
        if (clientSocketID) { 
            io.to(clientSocketID).emit('newBid', bidDetails);
        }
    }
}
