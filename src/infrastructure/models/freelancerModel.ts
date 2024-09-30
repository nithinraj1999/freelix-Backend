import mongoose, { Document, Model, Schema } from "mongoose";
import { IFreelancer } from "../../domain/entities/freelancer";

const freelancerSchema: Schema = new Schema({
  userID: { type: String, required: true },
  description: { type: String },
  skills: { type: [String], required: true }, // Array of strings
  languages: { type: [String], required: true }, // Array of strings
});

const FreelancerModel: Model<IFreelancer & Document> = mongoose.model<IFreelancer & Document>(
  "Freelancer",
  freelancerSchema
);

export default FreelancerModel;
