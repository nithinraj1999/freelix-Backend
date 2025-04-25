import { Request, Response, NextFunction } from 'express'
import { IOrderUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IOrderUseCase';
import Stripe from "stripe";
import { IPaymentUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IPaymentUseCase';

export class PaymentController{

    private orderUseCase
    private paymentUseCase
    
    constructor(orderUseCase:IOrderUseCase,paymentUseCase:IPaymentUseCase){
        this.orderUseCase = orderUseCase
        this.paymentUseCase = paymentUseCase
    }


    async makePayment(req: Request, res: Response,next:NextFunction){
        try{
          const {bidAmount,userId,bidId,freelancerId,jobId} = req.body
          const order = await this.orderUseCase.storeOrder(bidAmount,userId,bidId,freelancerId,jobId);
          const stripe = new Stripe(process.env.STRIPE_SECRET as string);
          const lineItems = [
            {
              price_data: {
                currency: 'usd', 
                product_data: {
                  name: 'Product 1', 
                },
                unit_amount: bidAmount*100, 
              },
              quantity: 1, 
            },
          ];
      
          const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:process.env.STRIPE_SUCCESS_URL,
            cancel_url:process.env.STRIPE_CANCEL_URL,
          })
          
          res.json({id:session.id})
        }catch(error){ 
          console.error(error);
        }  
      }

      async releasePayment(req: Request, res: Response){
        try{
            const {projectId,clientId,freelancerId,total} =req.body
            const allHirings = await this.paymentUseCase.releasePayment(projectId,clientId,freelancerId,total);
            res.status(200).json({success:true})
        }catch(error){
          console.error(error);
          res.status(500).json({success:false})
        }
      }
}