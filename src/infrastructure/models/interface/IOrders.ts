import { ObjectId } from 'mongodb'; // or 'mongoose' depending on your setup

// Enum for Order Status
export enum OrderStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

// Enum for Payment Status
export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

// Interface for Order
export interface Order {
  _id: ObjectId; // MongoDB ObjectId for the Order document
  projectId: ObjectId; // Reference to the Project
  clientId: ObjectId; // Reference to the Client (User)
  freelancerId: ObjectId; // Reference to the Freelancer (User)
  bidId?: ObjectId; // Reference to the Bid (optional, may not always be present)
  status: OrderStatus; // Order status
  paymentStatus: PaymentStatus; // Payment status
  total:Number
  orderDate: Date; // Date the order was created
}
