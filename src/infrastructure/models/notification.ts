import mongoose, { Document, Model, Schema } from "mongoose";

import { Types } from "mongoose";

export enum NotificationType {
  JOB = "job",
  BIDDING = "bidding",
  MESSAGE = "message",
}

export interface INotification {
  userId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  isRead: boolean;
  jobId?: Types.ObjectId;
  bidId?: Types.ObjectId;
  messageId?: Types.ObjectId;
  createdAt: Date;
}

 interface NotifikcationType{
  userID:string,
  freelancerId:string,
  freelancerName:string,
  isRead:string,
  bidAmount:string,
  createdAt:string,
}


const notificationSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  freelancerId: { type: Schema.Types.ObjectId, required: true }, 
  freelancerName: { type: String,  required: true },
  isRead: { type: Boolean, default: false },
  bidAmount: { type: Number,required: true  },  
  createdAt: { type: Date, default: Date.now }, 
});

const notificationModel: Model<NotifikcationType & Document> = mongoose.model<NotifikcationType & Document>(
  "Notification",
  notificationSchema
);

export default notificationModel;
