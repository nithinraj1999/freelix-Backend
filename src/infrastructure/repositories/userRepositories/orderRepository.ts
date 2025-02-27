import { IOrderRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IOrderRepository"

export class OrderRepository implements IOrderRepository{
    
    private ordermodel
    private escrowModel
    constructor(ordermodel:any,escrowModel:any){
        this.ordermodel = ordermodel
        this.escrowModel = escrowModel
    }

    async storeOrder(
        bidAmount: string,
        userId: string,
        bidId: string,
        freelancerId: string,
        jobId: string
    ) {
        try {
            const order = await this.ordermodel.create({
                projectId: jobId,
                clientId: userId,
                freelancerId: freelancerId,
                bidId: bidId,
                paymentStatus: 'completed',
                total: bidAmount,
            })

            // ========= store funds in escrow

            const escrow = await this.escrowModel.create({
                clientId: userId,
                freelancerId: freelancerId,
                projectId: jobId,
                amount: bidAmount,
            })

            return order
        } catch (error) {
            throw error
        }
    }


    async getAllHirings(clientId: string) {
        try {
            const hirings = await this.ordermodel.find({ clientId: clientId })
                .populate('projectId','title')
                .populate('freelancerId', 'name')
            return hirings
        } catch (error) {
            throw error
        }
    }


    async getDeliverable(orderId:string){
        try{
          const order = await this.ordermodel.findOne({_id:orderId}, { "delivery.fileUrl": 1,_id:0 })
          return order
        }catch(error){
          throw error
        }
    }

}