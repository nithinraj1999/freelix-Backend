
import { Types } from "mongoose";

export enum NotificationType {
  JOB = "job",
  BIDDING = "bidding",
  MESSAGE = "message",
}

export interface Notification {
  userId: string;
  freelancerId: string;
  isRead: boolean;
  jobId?: string;
  bidId?: string;
  messageId?: string;
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
