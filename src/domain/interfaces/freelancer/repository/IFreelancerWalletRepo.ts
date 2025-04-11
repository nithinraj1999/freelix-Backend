export interface IFreelancerWalletRepository{
    fetchWallet(freelancerId: string):Promise<any>
}