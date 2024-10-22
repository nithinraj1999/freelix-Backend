import mongoose, {Schema } from 'mongoose';
import { IBid } from "./interface/IBidModel";

const BidSchema: Schema = new Schema(
    {
        jobId: {
            type: String,
            required: true,
            ref: 'Job', // Assuming there's a Job model
        },
        freelancerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Freelancer',
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
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

const BidModel = mongoose.model<IBid>('Bid', BidSchema);

export default BidModel;
