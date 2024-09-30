import mongoose, { Document, Model, Schema } from "mongoose";
import { User } from "../../domain/entities/user";

const userSchema: Schema = new Schema({

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:{ type: Number, required: true },
  role: { type: String, enum: ["client", "freelancer", "admin"], default: "client" }, 
  profilePicture: { type: String },
  description: { type: String },
  skills: { type: [String],  },
  languages: { type: [String], }, 
  isBlock:{type:Boolean,default:false},
  isAdmin:{type:Boolean,default:false},
  isVerified:{type:Boolean,default:false},
  hasFreelancerAccount:{type:Boolean,default:false}
});

const userModel: Model<User & Document> = mongoose.model<User & Document>('User', userSchema);

export default userModel;
