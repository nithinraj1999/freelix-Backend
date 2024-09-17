
import { User,IUser } from "./user";


export interface IFreelancer extends IUser {
  role: "freelancer"; // Role should be exactly "freelancer"
  bio: string;
  skills: string[];
  experience: string[];
  portfolio: string[];
}


export class Freelancer extends User implements IFreelancer {
  public bio: string;
  public skills: string[];
  public experience: string[];
  public portfolio: string[];
  public role: "freelancer"; 

  constructor(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    bio: string,
    skills: string[],
    experience: string[],
    portfolio: string[]
  ) {
    super(name, email, passwordHash, "freelancer");
    this.bio = bio;
    this.skills = skills;
    this.experience = experience;
    this.portfolio = portfolio;
    this.role = "freelancer"; 
  }
}
