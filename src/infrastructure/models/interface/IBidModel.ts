import mongoose, { Document, Schema } from 'mongoose';

export interface IBid extends Document {
    _id:string;
    jobId: string;
    freelancerId: string;
    bidAmount: number;
    deliveryDays: number;
    proposal: string;
    createdAt: Date;
    updatedAt: Date;
}
