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
exports.PaymentRepository = void 0;
class PaymentRepository {
    constructor(EscrowModel, WalletModel, OrderModel) {
        this.escrowModel = EscrowModel;
        this.walletModel = WalletModel;
        this.orderModel = OrderModel;
    }
    releasePayment(projectId, clientId, freelancerId, total) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalAmount = parseFloat(total);
                const freelancerAmount = totalAmount * 0.7;
                const platformCharge = totalAmount * 0.3;
                const escrowUpdate = yield this.escrowModel.findOneAndUpdate({ clientId, freelancerId, projectId }, { $set: { amount: platformCharge } }, { new: true }).populate('projectId');
                let freelancerWallet = yield this.walletModel.findOne({
                    userId: freelancerId,
                });
                if (!freelancerWallet) {
                    freelancerWallet = new this.walletModel({
                        userId: freelancerId,
                        balance: freelancerAmount,
                        walletHistory: [
                            {
                                date: new Date(),
                                amount: freelancerAmount,
                                type: 'Credit',
                                description: `Payment received for project - ${escrowUpdate === null || escrowUpdate === void 0 ? void 0 : escrowUpdate.projectId.title}`,
                            },
                        ],
                    });
                    const saveResult = yield freelancerWallet.save();
                    if (!saveResult) {
                        throw new Error('Failed to create freelancer wallet.');
                    }
                }
                else {
                    freelancerWallet.balance += freelancerAmount;
                    freelancerWallet.walletHistory.push({
                        date: new Date(),
                        amount: freelancerAmount,
                        type: 'Credit',
                        description: `Payment received for project - ${escrowUpdate === null || escrowUpdate === void 0 ? void 0 : escrowUpdate.projectId.title}`,
                    });
                    const updateResult = yield freelancerWallet.save(); // Save the updated balance and history
                    if (!updateResult) {
                        throw new Error('Failed to update freelancer wallet.');
                    }
                }
                const order = yield this.orderModel.updateOne({ projectId: projectId }, { $set: { isPaymentReleased: true } });
                return {
                    success: true,
                    freelancerAmount,
                };
            }
            catch (error) {
                console.error('Error releasing payment:', error);
                throw error;
            }
        });
    }
}
exports.PaymentRepository = PaymentRepository;
