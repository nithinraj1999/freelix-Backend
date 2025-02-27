export interface IPaymentUseCase{
    releasePayment(projectId:string,clientId:string,freelancerId:string,total:string):Promise<any>
}


