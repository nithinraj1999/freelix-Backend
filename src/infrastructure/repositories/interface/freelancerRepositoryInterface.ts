import { IFreelancer } from "../../../domain/entities/freelancer";

export interface IFreelancerRepository {
    createFreelancerAccount(data:IFreelancer,profileImagePath:string |null):Promise<any>
    findFreelancerById(id:string) :Promise<any>
    switchToBuying(id:string):Promise<any>
    switchToSelling(id:string):Promise<any>
    jobList():Promise<any>
    editProfile(data:any,file: string | null):Promise<any>
}
