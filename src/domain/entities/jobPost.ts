// export interface IJobDetailsType {
//   category: string;
//   createdAt: string;
//   description: string;
//   experience: string;
//   file?: string | null;
//   fixedPrice?: number;
//   hourlyPrice?: {
//     from: number;
//     to: number;
//   };
//   paymentType: string;
//   skills: string[];
//   subCategory: string;
//   title: string;
//   userID: string;
//   _id: string;
// }
export interface IJobPost {
  userID: string; 
  title: string;
  category: string;
  subCategory: string;
  description: string;
  file: string;
  deadline:number;
  skills: string[]; 
  experience: string;
  paymentType:string;
  fixedPrice: number;
  hourlyPrice: {
    from: number; 
    to: number; 
  };
  isDelete:boolean;
  createdAt: Date;
}