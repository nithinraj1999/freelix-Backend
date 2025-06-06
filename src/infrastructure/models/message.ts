import mongoose, { Schema, Document } from 'mongoose';

 interface IMessage extends Document {
  senderId: string;
  recipientId: string;
  text: string;
  file:string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, ref: 'User'  },
  recipientId: { type: String,ref: 'User' },
  file: { type: String },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
