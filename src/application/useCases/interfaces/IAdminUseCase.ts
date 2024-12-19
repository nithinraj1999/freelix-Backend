import { promises } from "node:dns"
import { User } from "../../../domain/entities/user"

export interface IAdminUseCase{
    authenticateAdmin(email:string,password:string) :Promise<any>
    getClientData(skip:number,limit:number):Promise<any>
    getTotalClients():Promise<any>
    blockClient(clientID:string):Promise<any>
    unblockClient(clientID:string):Promise<any>
    createUser(data:User,profileUrl:any | null):Promise<any>
    editUser(data:User,profileUrl:string | null):Promise<any>

    getFreelancerData():Promise<any>
    blockFreelancer(clientID:string):Promise<any>
    unblockFreelancer(clientID:string):Promise<any>
    createFreelancer(data:User,profileUrl:string | null):Promise<any>
    editFreelancer(data:User,profileUrl:string | null):Promise<any>
    addSkills(skill:string,description:string):Promise<any>
    getDashboardData():Promise<any>
    getAllSkills():Promise<any>
}