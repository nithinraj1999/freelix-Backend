import { IFreelancerJobPostRepository } from "../../../domain/interfaces/freelancer/repository/IFreelancerJobPostRepository"

export class FreelancerJobRepository implements IFreelancerJobPostRepository{
    private jobPostModel: any

    constructor(jobPostModel: any) {
        this.jobPostModel = jobPostModel
    }

    async jobList(
        projectType: string,
        minPrice: string,
        maxPrice: string,
        skills: string[],
        deliveryDays: string,
        sort: string,
        search: string,
        page: string,
        experience: string,
        freelancerSkills: any
    ) {
        try {
            const query: {
                isDelete: boolean
                paymentType?: string
                fixedPrice?: { $gte?: number; $lte?: number }
                $and?: {
                    'hourlyPrice.from'?: { $gte: number }
                    'hourlyPrice.to'?: { $lte: number }
                }[]
                skills?: { $in: string[] }
                title?: { $regex: string; $options: string }
                experience?: string
            } = {
                isDelete: false,
            }

            if (projectType) {
                query.paymentType = projectType
            }

  const min = minPrice ? parseInt(minPrice, 10) : undefined
const max = maxPrice ? parseInt(maxPrice, 10) : undefined
    if (min !== undefined || max !== undefined) {
        query.fixedPrice = {}
        if (min !== undefined) query.fixedPrice.$gte = min
        if (max !== undefined) query.fixedPrice.$lte = max
    }
if (projectType === 'fixed') {

} else if (projectType === 'hourly') {
    const hourlyConditions = []
    if (min !== undefined) {
        hourlyConditions.push({ 'hourlyPrice.from': { $gte: min } })
    }
    if (max !== undefined) {
        hourlyConditions.push({ 'hourlyPrice.to': { $lte: max } })
    }
    if (hourlyConditions.length > 0) {
        query.$and = hourlyConditions
    }
}


            if (skills && skills.length > 0) {
                query.skills = { $in: skills }
            }

            if (search) {
                query.title = { $regex: search, $options: 'i' }
            }
            if (freelancerSkills?.length) {
                query.skills = { $in: freelancerSkills }
            }
            let sortOption = {}
            if (sort === 'lowToHigh') {
                if (projectType === 'fixed') {
                    sortOption = { fixedPrice: 1 }
                } else if (projectType === 'hourly') {
                    sortOption = { 'hourlyPrice.from': 1 }
                }
            } else if (sort === 'highToLow') {
                if (projectType === 'fixed') {
                    sortOption = { fixedPrice: -1 }
                } else if (projectType === 'hourly') {
                    sortOption = { 'hourlyPrice.from': -1 }
                }
            }

            if (experience && experience != 'any') {
                query.experience = experience
            }
            const skip = parseInt(page) * 3 - 3
            console.log(query);
            console.log(minPrice);
                        console.log(maxPrice);

            const jobList = await this.jobPostModel
                .find(query)
                .sort(sortOption) 
                .skip(skip)
                .limit(3)
            const count = await this.jobPostModel.countDocuments(query)
            return { jobList, count }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getJobListCount() {
        try {
            const count = await this.jobPostModel.countDocuments({
                isDelete: false,
            })
            return count
        } catch (error) {
            throw error
        }
    }

    async jobDetails(jobID: string) {
        try {
            const jobDetails = await this.jobPostModel.findOne({ _id: jobID })
            return jobDetails
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
