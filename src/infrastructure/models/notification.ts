const mongoose = require("mongoose");

import { Types } from "mongoose";

export enum NotificationType {
  JOB = "job",
  BIDDING = "bidding",
  MESSAGE = "message",
}

export interface INotification {
  userId: Types.ObjectId;
  type: NotificationType;
  isRead: boolean;
  jobId?: Types.ObjectId;
  bidId?: Types.ObjectId;
  messageId?: Types.ObjectId;
  createdAt: Date;
}

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user receiving the notification
  type: { type: String, enum: ["job", "bidding", "message"], required: true }, // Type of notification
  isRead: { type: Boolean, default: false },
  jobId: { type: Schema.Types.ObjectId, ref: "JobPost" },  // Fields for job notifications
  bidId: { type: Schema.Types.ObjectId, ref: "Bid" },  // Fields for bidding notifications
  messageId: { type: Schema.Types.ObjectId, ref: "Message" },  // Fields for message notifications
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Notification", notificationSchema);
