import { IFreelancerOrderRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerOrderRepository"

export class FreelancerOrderRepository implements IFreelancerOrderRepository {
    private orderModel: any
    constructor(orderModel: any) {
        this.orderModel = orderModel
    }
    async getMyOrders(freelancerId: string) {
        try {
            const orders = await this.orderModel
                .find({ freelancerId: freelancerId })
                .populate({ path: 'projectId', select: 'title description' })
                .populate({ path: 'bidId', select: 'deliveryDays' })
                .populate({ path: 'clientId', select: 'profilePicture' })
                
            return orders
        } catch (error) {
            throw error
        }
    }


     async completeOrder(orderId: string, description: string, file: any) {
            try {
                const uploadDate = new Date()
                const orders = await this.orderModel.updateOne(
                    { _id: orderId },
                    {
                        $set: {
                            delivery: {
                                description: description,
                                fileUrl: file,
                                uploadDate: uploadDate,
                            },
                            status: 'Completed',
                        },
                    }
                )
                return orders
            } catch (error) {
                throw error
            }
        }
}
