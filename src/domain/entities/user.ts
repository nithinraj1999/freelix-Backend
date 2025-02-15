export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;  // Optional because social logins may not have it
  phone: number;
  role: "client" | "freelancer" | "admin";
  profilePicture: string;
  title: string;
  description: string;
  skills: string[];
  languages: string[];
  isBlock: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  hasFreelancerAccount: boolean;
  isFreelancerBlock: boolean;
  portfolio: PortfolioItem[];
}

export interface PortfolioItem {
  image?: string;
  title?: string;
  description?: string;
}
