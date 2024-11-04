import { io } from "../../index"; // Import the io instance
import { User as UserEntity } from "../../domain/entities/user"; 
import { IBid } from "../../domain/entities/bid";

export class NotificationService {

    static sendJobPostNotification(freelancers: UserEntity[], jobData: any) {
        freelancers.forEach((freelancer) => {
            console.log("socketid..",freelancer.socketId);
            if (freelancer.socketId) { 
                const data: any = {
                    jobId: jobData._id,
                    title: jobData.title,
                    paymentType: jobData.paymentType,
                    createdAt:jobData.createdAt
                }; 
            
                if (jobData.paymentType === "fixed") {
                    data.fixedPrice = jobData.fixedPrice;
                }
            
                if (jobData.paymentType === "hourly") {
                    data.hourlyPrice = {
                        from: jobData.hourlyPrice.from,
                        to: jobData.hourlyPrice.to
                    };
                }

                io.to(freelancer.socketId).emit('newJobNotification',data );
            }
        });
    }

     static sendNewBidDetails(clientSocketID:string,bidDetails:IBid){
        console.log("socket.......",bidDetails.jobId?._id);
            const jobId = bidDetails.jobId?._id.toString()
            console.log(jobId);
            
        if (clientSocketID) { 
            io.to(clientSocketID).emit(jobId, bidDetails);
        }
    }    
}
