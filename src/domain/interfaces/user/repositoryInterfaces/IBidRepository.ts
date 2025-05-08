import { Bid } from "../../../entities/bid"
import { User } from "../../../entities/user"
export interface IBidRepository{
    allBids(jobId: string):Promise<(Bid & { freelancerId: User })[]>
}