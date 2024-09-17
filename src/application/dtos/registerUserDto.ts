export interface RegisterUserDto {
    id:string;
    name: string;
    email: string;
    password: string;
    role?: "client" | "freelancer" | "admin";
  }
  