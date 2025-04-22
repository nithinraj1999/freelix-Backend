export interface IFreelancerWalletUseCase{
    fetchWallet(freelancerId: string):Promise<any>
}