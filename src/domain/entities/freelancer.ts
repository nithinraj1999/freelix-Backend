
import { User } from "./user";


export interface IFreelancer {
  // role: "freelancer"; // Role should be exactly "freelancer"
  userID:string;
  name:string;
  description: string;
  skills: string[];
  education: string[];
  languages:string[]
}

