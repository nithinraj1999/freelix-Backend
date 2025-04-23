import { User } from "../../../entities/user";

export interface IAdminClientUseCase {
    getClientData(skip: number, limit: number): Promise<any>;
    getTotalClients(): Promise<number>;
    blockClient(clientID: string): Promise<any>;
    unblockClient(clientID: string): Promise<any>;
    createUser(data:User,profileUrl:any | null):Promise<any>
    editUser(data: User, profileUrl: any):Promise<any>
}
  