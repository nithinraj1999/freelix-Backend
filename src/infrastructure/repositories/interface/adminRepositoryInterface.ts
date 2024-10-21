import { User } from "../../../domain/entities/user";
export interface IAdminRepository {
  findByEmail(email: string): Promise<User | null>;
  getAllClientData(skip:number,limit:number):Promise<any>
  totalClients():Promise<any>
  blockClient(clientID:string):Promise<any>
  unblockClient(clientID:string):Promise<any>
  createUser(data:object,imagePath:string | null,hashedPassword:string):Promise<any>
  editUser(data:object,imagePath:string | null):Promise<any>

  getAllFreelancerData():Promise<any>
  blockFreelancer(clientID:string):Promise<any>
  unblockFreelancer(clientID:string):Promise<any>
  createFreelancer(data:object,imagePath:string | null,hashedPassword:string):Promise<any>
  editFreelancer(data:object,imagePath:string | null):Promise<any>
}
