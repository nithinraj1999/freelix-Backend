import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
    userID: mongoose.Types.ObjectId;
    otp: string;
    email:string
    createdAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }
});

// Create the OTP model
const Otp: Model<IOtp> = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
