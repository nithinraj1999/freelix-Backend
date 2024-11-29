import { IFreelancer } from "../../../domain/entities/freelancer";
import { IBid } from "../../../domain/entities/bid";
export interface IFreelancerRepository {
    createFreelancerAccount(data:IFreelancer,profileImagePath:string |null):Promise<any>
    findFreelancerById(id:string) :Promise<any>
    switchToBuying(id:string):Promise<any>
    switchToSelling(id:string):Promise<any>
    jobList(projectType:string,minPrice:string,maxPrice:string,skills:any,deliveryDays:string,sort:string,search:string,page:string,experience:string,freelancerSkills:any):Promise<any>
    getJobListCount():Promise<any>
    editProfile(data:any,file: string | null):Promise<any>
    jobDetails(jobID:string):Promise<any>

    isExistingBidder(jobId:string,userId:string):Promise<any>
    submitBid(jobId:string,freelancerId:string,bidAmount:string,deliveryDays:string,proposal:string):Promise<any>
    getAllBids(jobId:string):Promise<any>
    editBid(data: Partial<IBid>):Promise<any>
    myBids(userId:string):Promise<any>
    myBidDetails(bidID:string):Promise<any>
    withdrawBid(bidId:string):Promise<any>

    getFreelancerDetails(freelancerId:string):Promise<any>
    deletePortFolioImg(imageId:string,userId:string):Promise<any>
    storeNotification(userID:string,freelancerId:string,freelancerName:string,createdAt:string,bidAmount:string):Promise<any>

    getMyOrders(freelancrId:string):Promise<any>
    completeOrder(orderId:string,description:string,file:string |null):Promise<any>

    fetchReviews(freelancerId:string):Promise<any>
    fetchWallet(freelancerId:string):Promise<any>

    dashboardData(userId:string):Promise<any>

    getSkills():Promise<any>
}
