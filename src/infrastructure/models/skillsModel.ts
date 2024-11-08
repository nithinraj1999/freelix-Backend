import mongoose, { Document, Model, Schema } from "mongoose";




 interface skillsType{
    skill:string,
    description:string,
  
}


const skillsSchema = new Schema({
  skill:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  }

});

const skillsModel: Model<skillsType & Document> = mongoose.model<skillsType & Document>(
  "Skills",
  skillsSchema
);

export default skillsModel;
