import mongoose, { Schema, Document } from 'mongoose';
import { IEscrow } from './interface/IEscrow';

const EscrowSchema: Schema = new Schema(
  {
    clientId: { type: String, required: true },
    freelancerId: { type: String, required: true },
    projectId:{ type: String, required: true},
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'released', 'disputed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    releasedAt: { type: Date },
  },
  { timestamps: true }
);

const EscrowModel = mongoose.model<IEscrow>('Escrow', EscrowSchema);
export default EscrowModel;
