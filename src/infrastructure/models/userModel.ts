import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../../domain/entities/user";

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "freelancer", "admin"],
   
  },
  profilePicture: { type: String },
});

const UserModel = mongoose.model<IUser & Document>("User", userSchema);

export default UserModel;
