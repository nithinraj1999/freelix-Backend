import mongoose, { Document, Model, Schema, Types } from "mongoose";

// Define the interface for the JobPost document
export interface IJobPost extends Document {
  userID?: Types.ObjectId; // Reference to the User model
  title: string;
  category?: string;
  subCategory?: string;
  description: string;
  file?: string;
  skills: string[]; // Array of strings
  experience: string;
  paymentType:string;
  fixedPrice?: number;
  hourlyPrice?: {
    from: number; // Start of hourly rate range
    to: number; // End of hourly rate range
  };
  createdAt?: Date;
}

// Define the JobPost schema
const jobPostSchema: Schema<IJobPost> = new Schema({
  userID: {
    type: Schema.Types.ObjectId, // ObjectId type for referencing other documents
    ref: "User", // Reference to the 'User' model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    
  },
  subCategory: {
    type: String,
    
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  skills: {
    type: [String],
    required: true, // Array of strings for skills
  },
  experience: {
    type: String,
    required: true,
  },
  paymentType:{
    type:String,
    required:true 
  },
  fixedPrice: {
    type: Number, // Optional fixed price
  },
  hourlyPrice: {
    from: {
      type: Number,
    },
    to: {
      type: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const jobPostModel: Model<IJobPost> = mongoose.model<IJobPost>(
  "JobPost",
  jobPostSchema
);

export default jobPostModel;
