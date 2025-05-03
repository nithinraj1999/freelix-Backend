export interface Otp  {
  otp: string;
  email: string;
  createdAt: Date;
  userData: {
    name: string;
    email: string;
    password: string;
    phone: number;
  };
}

