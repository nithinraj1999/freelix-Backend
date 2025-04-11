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
exports.OrderUseCase = void 0;
class OrderUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    storeOrder(bidAmount, userId, bidId, freelancerId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.orderRepository.storeOrder(bidAmount, userId, bidId, freelancerId, jobId);
                return order;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllHirings(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allHiring = yield this.orderRepository.getAllHirings(clientId);
                return allHiring;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDeliverable(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliverable = yield this.orderRepository.getDeliverable(orderId);
                return deliverable;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OrderUseCase = OrderUseCase;
