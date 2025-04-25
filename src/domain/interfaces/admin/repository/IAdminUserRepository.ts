import { User } from "../../../entities/user";

export interface IAdminUserRepository {
    getAllClients(skip: number, limit: number):Promise<any>
    getAllClientData(skip: number, limit: number):Promise<any>;
    totalClients(): Promise<number>;
    blockClient(id: string): Promise<any>;
    unblockClient(id: string): Promise<any>;
    createUser(data: User, profileUrl:string |null, hashedPassword: string): Promise<User>;
    editUser(data: User, profileUrl: null|string): Promise<any>;
}
  