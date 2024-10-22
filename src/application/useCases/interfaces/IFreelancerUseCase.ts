import { IFreelancer } from "../../../domain/entities/freelancer";
export interface FreelancerUseCaseInterface{
    createFreelancer(data:IFreelancer,profileImagePath:string | null):Promise<any>
    findFreelancerById (id:string):Promise<any>
    switchToBuying(id:string):Promise<any>
    switchToSelling(id:string):Promise<any>
    getJobList():Promise<any>
    editProfile(data:any,file: Express.Multer.File | null):Promise<any>
    getJobDetails(jobID:string):Promise<any>

    isBidderAlreadyExist(jobId:string,userId:string):Promise<any>
    submitBid(jobId:string,freelancerId:string,bidAmount:string,deliveryDays:string,proposal:string):Promise<any>
}