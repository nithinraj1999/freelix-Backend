import { Request, Response } from 'express'
import { IFreelancerOrderUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerOrderUseCase'

export class FreelancerOrderController {
constructor(private readonly freelancerOrderUseCase:IFreelancerOrderUseCase){}
   
async getMyOrders(req: Request, res: Response) {
    try {
        const { freelancerId } = req.body
        console.log(freelancerId)

        const myOrders = await this.freelancerOrderUseCase.getMyOrders(
            freelancerId
        )
        res.json({ success: true, orders: myOrders })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching orders.',
        })
    }
}

async completeOrder(req: Request, res: Response) {
    try {
        const file = req.file 
        const { orderId, description } = req.body
        const completeOrder = await this.freelancerOrderUseCase.completeOrder(
            orderId,
            description,
            file
        )
        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'An error occurred .',
        })
    }
}
  }
  