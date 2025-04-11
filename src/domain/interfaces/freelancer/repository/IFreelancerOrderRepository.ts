export interface IFreelancerOrderRepository{
    getMyOrders(freelancerId: string):Promise<any>
    completeOrder(orderId: string, description: string, file: string):Promise<any>
}