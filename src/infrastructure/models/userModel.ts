import mongoose, { Document, Model, Schema } from "mongoose";
import { User } from "../../domain/entities/user";

export interface IUserDocument extends Omit<Document, '_id'>, User {
  
}

const userSchema: Schema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  role: {
    type: String,
    enum: ["client", "freelancer", "admin"],
    default: "client",
  },
  profilePicture: { type: String },
  title: { type: String },
  description: { type: String },
  skills: { type: [String] },
  languages: { type: [String] },
  isBlock: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  hasFreelancerAccount: { type: Boolean, default: false },
  isFreelancerBlock: { type: Boolean, default: false },
  portfolio: [{ 
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  
  },]
});

const userModel: Model<User & Document> = mongoose.model<User & Document>(
  "User",
  userSchema
);

export default userModel;
