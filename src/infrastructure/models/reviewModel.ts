import mongoose, { Document, Schema } from 'mongoose';

interface IReview extends Document {
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  comment: string;
  rating:Number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
 
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  rating:{
    type:Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const ReviewModel= mongoose.model<IReview>('Review', reviewSchema);
export default ReviewModel;
