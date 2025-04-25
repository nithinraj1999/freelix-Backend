import { Request, Response, NextFunction } from 'express'
import { User } from '../../../../domain/entities/user'
import { IJobPostUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IJobPostUseCase'

export class JobPostController {
    private JobPostUsecase: IJobPostUseCase
    private userSocketMap
    private notificationService
    
    constructor(
        JobPostUsecase: IJobPostUseCase,
        userSocketMap: any,
        NotificationService: any
    ) {
        this.JobPostUsecase = JobPostUsecase
        this.userSocketMap = userSocketMap
        this.notificationService = NotificationService
    }

    async createJobPost(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file ? req.file.path : null
            const jobPost = await this.JobPostUsecase.createJobPost(
                req.body,
                file
            )
            const freelancers: User[] =
                await this.JobPostUsecase.getAllFreelancers()

            const freelancersWithSocketIds = freelancers
                .filter((freelancer) =>
                    this.userSocketMap.has(freelancer._id.toString())
                )
                .map((freelancer) => ({
                    ...freelancer,
                    socketId: this.userSocketMap.get(freelancer._id.toString()),
                }))

            this.notificationService.sendJobPostNotification(
                freelancersWithSocketIds,
                jobPost
            )

            res.status(200).json({ success: true, data: jobPost })
        } catch (error) {
            console.error('Error in controller:', error)
            res.status(500).json({
                success: false,
                error: 'Failed to create job post',
            })
        }
    }

    async getAllJobPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { userID, searchQuery, page } = req.body

            const jobPosts = await this.JobPostUsecase.getAllJobPosts(
                userID,
                searchQuery,
                page
            )
            res.status(200).json({ success: true, jobPosts })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                error: 'Failed to fetch job posts',
            })
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.body
            const deletedJobPost = await this.JobPostUsecase.deleteJobPost(
                jobId
            )
            res.status(200).json({
                success: true,
                deletedJobPost: deletedJobPost,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async editPost(req: Request, res: Response, next: NextFunction) {
        try {
            const editedPost = await this.JobPostUsecase.editPost(req.body)
            res.status(200).json({ success: true, editedPost: editedPost })
        } catch (error) {
            console.error(error)
            res.json({ success: false })
        }
    }

    async jobPostdetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobID } = req.body
            const jobDetails = await this.JobPostUsecase.jobDetails(jobID)
            res.json({ success: true, jobDetails: jobDetails })
        } catch (error) {
            console.error(error)
            res.json({ success: false })
        }
    }

    async getSkills(req: Request, res: Response, next: NextFunction) {
        try {
            const skills = await this.JobPostUsecase.getSkills()
            res.status(200).json({ success: true, skills: skills })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }
}
