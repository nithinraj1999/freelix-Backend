export interface IPaymentRepository{
    releasePayment(projectId: string,clientId: string,freelancerId: string,total: string):Promise<any>
}