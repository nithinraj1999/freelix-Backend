"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const IOrders_1 = require("./interface/IOrders");
const OrderSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    clientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    bidId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Bid' },
    status: { type: String, enum: IOrders_1.OrderStatus, default: IOrders_1.OrderStatus.Pending },
    paymentStatus: { type: String, enum: IOrders_1.PaymentStatus, default: IOrders_1.PaymentStatus.Pending },
    orderDate: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    delivery: {
        description: { type: String }, // Description from the freelancer
        fileUrl: { type: String }, // URL of the uploaded PDF file in Cloudinary
        uploadDate: { type: Date, default: Date.now },
    },
    isPaymentReleased: {
        type: Boolean,
        default: false
    }
});
const OrderModel = mongoose_1.default.model('Order', OrderSchema);
exports.default = OrderModel;
