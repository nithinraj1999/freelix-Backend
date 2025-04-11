"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const index_1 = require("../../index"); // Import the io instance
class NotificationService {
    sendJobPostNotification(freelancers, jobData) {
        try {
            freelancers.forEach((freelancer) => {
                console.log("socketid..", freelancer.socketId);
                if (freelancer.socketId) {
                    const data = {
                        jobId: jobData._id,
                        title: jobData.title,
                        paymentType: jobData.paymentType,
                        createdAt: jobData.createdAt
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
                    index_1.io.to(freelancer.socketId).emit('newJobNotification', data);
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    static sendNewBidDetails(clientSocketID, bidDetails) {
        var _a, _b;
        try {
            console.log("socket.......", (_a = bidDetails.jobId) === null || _a === void 0 ? void 0 : _a._id);
            const jobId = (_b = bidDetails.jobId) === null || _b === void 0 ? void 0 : _b._id.toString();
            if (clientSocketID) {
                index_1.io.to(clientSocketID).emit(jobId, bidDetails);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    static removeBid(clientSocketID, bidId) {
        try {
            const data = {
                bidId: bidId
            };
            if (clientSocketID) {
                index_1.io.to(clientSocketID).emit("removeBid", data);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    static sendNotification(clientSocketID, bidDetails) {
        try {
            if (clientSocketID) {
                index_1.io.to(clientSocketID).emit("notification", bidDetails);
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.NotificationService = NotificationService;
