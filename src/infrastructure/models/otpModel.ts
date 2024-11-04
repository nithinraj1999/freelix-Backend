
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  otp: string;
  email: string;
  createdAt: Date;
  userData: {
    name: string;
    email: string;
    password: string;
    phone: number;
  };
}

const otpSchema: Schema<IOtp> = new Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "24h"
  },
  userData: {  
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
  },
});

// Create the OTP model
const Otp: Model<IOtp> = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
