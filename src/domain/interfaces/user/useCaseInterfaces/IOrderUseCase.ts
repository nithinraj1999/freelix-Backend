export interface IOrderUseCase{
    storeOrder(bidAmount:string,userId:string,bidId:string,freelancerId:string,jobId:string):Promise<any>
    getAllHirings(clientId: string):Promise<any>
    getDeliverable(orderId: string):Promise<any>
}