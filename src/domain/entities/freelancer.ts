
import { User } from "./user";


export interface IFreelancer extends User {
  role: "freelancer"; // Role should be exactly "freelancer"
  bio: string;
  skills: string[];
  experience: string[];
  portfolio: string[];
}

