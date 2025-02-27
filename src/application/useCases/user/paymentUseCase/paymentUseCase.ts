

export class PaymentUseCase{
    private paymentRepository
    constructor(paymentRepository:any){
        this.paymentRepository  =paymentRepository
    }
    
async releasePayment(projectId:string,clientId:string,freelancerId:string,total:string){
    try{
      const releadPayment = await this.paymentRepository.releasePayment(projectId,clientId,freelancerId,total)
      return releadPayment
    }catch(error){
      throw error
    }
  }
}