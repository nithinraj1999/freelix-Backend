export interface IBidUseCase{
    fetchAllBids(jobId: string):Promise<any>
}