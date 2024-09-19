import mongoose, { Document, Model, Schema } from "mongoose";
import { User } from "../../domain/entities/user";

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "freelancer", "admin"], default: "client" }, 
  profilePicture: { type: String },
});


// Define the Mongoose model with type
const userModel: Model<User & Document> = mongoose.model<User & Document>('User', userSchema);

export default userModel;
