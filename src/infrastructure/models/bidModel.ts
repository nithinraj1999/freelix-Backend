import mongoose, {Schema } from 'mongoose';
import { IBid } from "./interface/IBidModel";

const BidSchema: Schema = new Schema(
    {
        jobId: {
            type: String,
            required: true,
            ref: 'JobPost', 
        },
        freelancerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        bidAmount: {
            type: Number,
            required: true,
        },
        deliveryDays: {
            type: Number,
            required: true,
        },
        proposal: {
            type: String,
            required: true,
           
        },
        status:{
            type: String,
            default: "pending",
        }
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

const BidModel = mongoose.model<IBid>('Bid', BidSchema);

export default BidModel;
