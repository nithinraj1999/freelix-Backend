
import mongoose, { Document, Schema } from 'mongoose';
import { Order,OrderStatus, PaymentStatus } from './interface/IOrders';
import { required } from 'joi';

const OrderSchema = new Schema<Order & Document>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  status: { type: String, enum: OrderStatus, default: OrderStatus.Pending },
  paymentStatus: { type: String, enum: PaymentStatus, default: PaymentStatus.Pending },
  orderDate: { type: Date, default: Date.now },
  total:{type:Number,required:true}
});

const OrderModel = mongoose.model<Order & Document>('Order', OrderSchema);

export default OrderModel;
