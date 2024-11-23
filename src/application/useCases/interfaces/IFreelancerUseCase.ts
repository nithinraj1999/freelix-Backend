import { promises } from "node:dns";
import { IFreelancer } from "../../../domain/entities/freelancer";
import { IBid } from "../../../domain/entities/bid";
export interface FreelancerUseCaseInterface{
    createFreelancer(data:IFreelancer,profileImagePath:string | null):Promise<any>
    findFreelancerById (id:string):Promise<any>
    switchToBuying(id:string):Promise<any>
    switchToSelling(id:string):Promise<any>
    getJobList(projectType:string,minPrice:string,maxPrice:string,skills:any,deliveryDays:string,sort:string,search:string,page:string,experience:string):Promise<any>
    getJobListCount():Promise<any>
    editProfile(data:any,file: Express.Multer.File | null):Promise<any>
    getJobDetails(jobID:string):Promise<any>
    isBidderAlreadyExist(jobId:string,userId:string):Promise<any>
    submitBid(jobId:string,freelancerId:string,bidAmount:string,deliveryDays:string,proposal:string):Promise<any>
    getAllBids(jobId:string):Promise<any>
    editBid(data: Partial<IBid>): Promise<any>

    myBids(userId:string):Promise<any>
    myBidDetails(bidID:string):Promise<any>
    withdrawBid(bidId:string):Promise<any>

    fetchFreelancerDetails(freelancerId:string):Promise<any>;
    deletePortFolioImg(imageId:string,userId:string):Promise<any>

    getMyOrders(freelancrId:string):Promise<any>
    completeOrder(orderId:string,description:string,file:string|null):Promise<any>
    fetchReviews(freelancerId:string):Promise<any>
    fetchWallet(freelancerId:string):Promise<any>

    dashboardData(userId:string):Promise<any>
}