"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelancerNotificationRepository = void 0;
class FreelancerNotificationRepository {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    storeNotification(userID, freelancerId, freelancerName, createdAt, bidAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newNotification = this.notificationModel.create({
                    userID: userID,
                    freelancerId: freelancerId,
                    freelancerName: freelancerName,
                    bidAmount: bidAmount,
                    createdAt: createdAt,
                });
                return newNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FreelancerNotificationRepository = FreelancerNotificationRepository;
