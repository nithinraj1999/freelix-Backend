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
exports.OrderRepository = void 0;
class OrderRepository {
    constructor(ordermodel, escrowModel) {
        this.ordermodel = ordermodel;
        this.escrowModel = escrowModel;
    }
    storeOrder(bidAmount, userId, bidId, freelancerId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.ordermodel.create({
                    projectId: jobId,
                    clientId: userId,
                    freelancerId: freelancerId,
                    bidId: bidId,
                    paymentStatus: 'completed',
                    total: bidAmount,
                });
                // ========= store funds in escrow
                const escrow = yield this.escrowModel.create({
                    clientId: userId,
                    freelancerId: freelancerId,
                    projectId: jobId,
                    amount: bidAmount,
                });
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllHirings(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hirings = yield this.ordermodel.find({ clientId: clientId })
                    .populate('projectId', 'title')
                    .populate('freelancerId', 'name');
                return hirings;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDeliverable(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.ordermodel.findOne({ _id: orderId }, { "delivery.fileUrl": 1, _id: 0 });
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OrderRepository = OrderRepository;
