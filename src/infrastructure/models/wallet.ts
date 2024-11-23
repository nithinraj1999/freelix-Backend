import mongoose, { Schema, Document } from 'mongoose';
import { IWallet } from './interface/IWallet';

const WalletSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    walletHistory: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['Credit', 'Debit'], required: true },
        description: {
          type: String,
          default: function (this: { type: string }) {
            // Explicitly type `this` to avoid the error
            return this.type === 'Credit' ? 'Credit Payment' : 'Debit Payment';
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const WalletModel = mongoose.model<IWallet & Document>('Wallet', WalletSchema);

export default WalletModel;
