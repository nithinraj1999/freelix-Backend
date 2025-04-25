export interface IBidRepository{
    allBids(jobId: string):Promise<any>
}