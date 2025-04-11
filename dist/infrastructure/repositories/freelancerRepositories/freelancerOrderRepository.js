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
exports.FreelancerOrderRepository = void 0;
class FreelancerOrderRepository {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    getMyOrders(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderModel
                    .find({ freelancerId: freelancerId })
                    .populate({ path: 'projectId', select: 'title description' })
                    .populate({ path: 'bidId', select: 'deliveryDays' })
                    .populate({ path: 'clientId', select: 'profilePicture' });
                return orders;
            }
            catch (error) {
                throw error;
            }
        });
    }
    completeOrder(orderId, description, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadDate = new Date();
                const orders = yield this.orderModel.updateOne({ _id: orderId }, {
                    $set: {
                        delivery: {
                            description: description,
                            fileUrl: file,
                            uploadDate: uploadDate,
                        },
                        status: 'Completed',
                    },
                });
                return orders;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FreelancerOrderRepository = FreelancerOrderRepository;
