import mongoose, { Document, Schema } from 'mongoose';
import { Order,OrderStatus, PaymentStatus } from './interface/IOrders';

const OrderSchema = new Schema<Order & Document>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  status: { type: String, enum: OrderStatus, default: OrderStatus.Pending },
  paymentStatus: { type: String, enum: PaymentStatus, default: PaymentStatus.Pending },
  orderDate: { type: Date, default: Date.now },
  total:{type:Number,required:true},
  delivery: {
    description: { type: String }, 
    fileUrl: { type: String },
    uploadDate: { type: Date, default: Date.now },
  },
  isPaymentReleased:{
    type:Boolean,
    default:false
  }
});

const OrderModel = mongoose.model<Order & Document>('Order', OrderSchema);

export default OrderModel;
