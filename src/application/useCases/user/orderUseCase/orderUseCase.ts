import { IOrderRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IOrderRepository'
import { IOrderUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IOrderUseCase'

export class OrderUseCase implements IOrderUseCase {

    private orderRepository: IOrderRepository
    
    constructor(orderRepository: IOrderRepository) {
        this.orderRepository = orderRepository
    }

    async storeOrder(bidAmount:string,userId:string,bidId:string,freelancerId:string,jobId:string) {
        try {
            const order = await this.orderRepository.storeOrder(
                bidAmount,
                userId,
                bidId,
                freelancerId,
                jobId
            )
            return order
        } catch (error) {
            console.error(error)
        }
    }
    async getAllHirings(clientId: string) {
        try {
            const allHiring = await this.orderRepository.getAllHirings(clientId)
            return allHiring
        } catch (error) {
            throw error
        }
    }

    async getDeliverable(orderId: string) {
        try {
            const deliverable = await this.orderRepository.getDeliverable(
                orderId
            )
            return deliverable
        } catch (error) {
            throw error
        }
    }
}
