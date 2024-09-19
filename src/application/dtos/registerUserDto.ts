export interface RegisterUserDto {
    name: string;
    email: string;
    password: string;
    role?: "client" | "freelancer" | "admin";
    profilePicture?:string
  }
  