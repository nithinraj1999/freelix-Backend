export interface IFreelancerOrderRepository{
    getMyOrders(freelancerId: string):Promise<any>
    completeOrder(orderId: string, description: string, file: any):Promise<any>
}