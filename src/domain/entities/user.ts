export interface User {
  _id?: any;
  name: string;
  socketId?:string;
  hasFreelancerAccount?:boolean;
  email: string;
  password?: string;
  phone: number;
  role?: "client" | "freelancer" | "admin";
  profilePicture?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
  description?: string;
  skills?: string[];
  education?: string[];
  languages?: string[];
  isFreelancerBlock?:boolean;
  
}
