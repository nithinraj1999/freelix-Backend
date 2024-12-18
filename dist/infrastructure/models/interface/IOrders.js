"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.OrderStatus = void 0;
// Enum for Order Status
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["InProgress"] = "in-progress";
    OrderStatus["Completed"] = "completed";
    OrderStatus["Cancelled"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// Enum for Payment Status
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Completed"] = "completed";
    PaymentStatus["Failed"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
