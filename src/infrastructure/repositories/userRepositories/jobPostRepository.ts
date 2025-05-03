import { IJobPostRepository } from '../../../domain/interfaces/user/repositoryInterfaces/IJobPostRepository'
import { IJobPost } from '../../../domain/entities/jobPost'

export class JobPostRepository implements IJobPostRepository {
    
    private jobPostModel: any
    constructor(jobPostModel: any) {
        this.jobPostModel = jobPostModel
    }

    async createJobPost(data: IJobPost, file: string | null):Promise<IJobPost> {
        try {
            const {
                userID,
                title,
                category,
                skills,
                subCategory,
                description,
                experience,
                fixedPrice,
                paymentType,
                hourlyPrice,
            } = data
            console.log(skills)
            const skillsArray: string[] = Array.isArray(skills)
                ? skills
                : typeof skills === 'string'
                ? JSON.parse(skills)
                : []

            const response = await this.jobPostModel.create({
                userID: userID,
                title: title,
                category: category,
                subCategory: subCategory,
                skills: skillsArray,
                file: file,
                description: description,
                experience: experience,
                paymentType: paymentType,
                fixedPrice: fixedPrice,
                hourlyPrice: {
                    from: hourlyPrice?.from,
                    to: hourlyPrice?.to,
                },
            })

            return response
        } catch (error) {
            console.error('Error creating job post:', error)
            throw new Error('Failed to create job post')
        }
    }

    async getAllJobPosts(userID: string, searchQuery: string, page: string) {
        try {
            const searchFilter = searchQuery
                ? {
                      $or: [
                          { title: { $regex: searchQuery, $options: 'i' } }, 
                      ],
                  }
                : {}
            const skip = parseInt(page) * 3 - 3
            const MyPost = await this.jobPostModel
                .find({ userID: userID, isDelete: false, ...searchFilter })
                .skip(skip)
                .limit(3)
            const totalDocs = await this.jobPostModel.countDocuments({
                userID: userID,
                isDelete: false,
                ...searchFilter,
            })
            return { MyPost, totalDocs }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async deleteJobPost(jobId: string) {
        try {
            const result = await this.jobPostModel.findByIdAndUpdate(
                { _id: jobId },
                { $set: { isDelete: true } }
            ) 
            return result
        } catch (error) {
            console.error(`Error deleting job with ID ${jobId}:`, error)
        }
    }


    async editPost(data: any) {
        try {
            const {
                _id,
                title,
                description,
                skills,
                paymentType,
                hourlyPrice,
                fixedPrice,
            } = data

            const updateData: Partial<{
                title: string
                description: string
                skills: string[]
                paymentType: string
                hourlyPrice?: {
                    from?: number
                    to?: number
                } | null
                fixedPrice?: number | null
            }> = {
                title,
                description,
                skills,
                paymentType,
            }

            if (paymentType === 'hourly') {
                updateData.hourlyPrice = {
                    from: hourlyPrice.from,
                    to: hourlyPrice.to,
                }
                updateData.fixedPrice = null
            } else if (paymentType === 'fixed') {
                updateData.fixedPrice = fixedPrice
                updateData.hourlyPrice = null
            }

            const result = await this.jobPostModel.findByIdAndUpdate(
                _id,
                updateData,
                {
                    new: true,
                }
            )

            if (result) {
                return result 
            } else {
                console.log('Job post not found.')
                return null 
            }
        } catch (error) {
            console.error(`Error updating job post with ID ${data._id}:`, error)
            throw error 
        }
    }


    async jobDetails(jobId: string):Promise<IJobPost> {
        try {
            const jobDetails = await this.jobPostModel.findOne({ _id: jobId })
            return jobDetails
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
