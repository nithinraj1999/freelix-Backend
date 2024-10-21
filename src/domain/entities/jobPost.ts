export interface IJobDetailsType {
  category: string;
  createdAt: string;
  description: string;
  experience: string;
  file?: string | null;
  fixedPrice?: number;
  hourlyPrice?: {
    from: number;
    to: number;
  };
  paymentType: string;
  skills: string[];
  subCategory: string;
  title: string;
  userID: string;
  _id: string;
}
