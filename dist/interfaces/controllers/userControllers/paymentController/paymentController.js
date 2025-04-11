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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
class PaymentController {
    constructor(orderUseCase, paymentUseCase) {
        this.orderUseCase = orderUseCase;
        this.paymentUseCase = paymentUseCase;
    }
    makePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bidAmount, userId, bidId, freelancerId, jobId } = req.body;
                const order = yield this.orderUseCase.storeOrder(bidAmount, userId, bidId, freelancerId, jobId);
                const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
                const lineItems = [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Product 1',
                            },
                            unit_amount: bidAmount * 100,
                        },
                        quantity: 1,
                    },
                ];
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: lineItems,
                    mode: "payment",
                    success_url: process.env.STRIPE_SUCCESS_URL,
                    cancel_url: process.env.STRIPE_CANCEL_URL,
                });
                res.json({ id: session.id });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    releasePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, clientId, freelancerId, total } = req.body;
                const allHirings = yield this.paymentUseCase.releasePayment(projectId, clientId, freelancerId, total);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
}
exports.PaymentController = PaymentController;
