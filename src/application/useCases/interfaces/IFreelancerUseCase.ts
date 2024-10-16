import { IFreelancer } from "../../../domain/entities/freelancer";
export interface FreelancerUseCaseInterface{
    createFreelancer(data:IFreelancer,profileImagePath:string | null):Promise<any>
    findFreelancerById (id:string):Promise<any>
    switchToBuying(id:string):Promise<any>
    switchToSelling(id:string):Promise<any>
    getJobList():Promise<any>
    editProfile(data:any):Promise<any>
}