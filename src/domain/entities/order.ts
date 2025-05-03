import { ObjectId } from 'mongodb'; 

export enum OrderStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}
export interface Delivery {
  description: string; 
  fileUrl: string;
  uploadDate: Date;  
}


export interface Order {
  _id: ObjectId; 
  projectId: ObjectId;
  clientId: ObjectId;
  freelancerId: ObjectId;
  bidId?: ObjectId;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total:Number
  orderDate: Date;
  delivery:Delivery;
  isPaymentReleased:Boolean;
}
