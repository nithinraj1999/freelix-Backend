import { Request, Response } from 'express'
import { IFreelancerJobPostUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerJobPostUseCase'

export class FreelancerJobPostController {
  constructor(private freelancerJobPostUseCase: IFreelancerJobPostUseCase) {}
  async getJobList(req: Request, res: Response) {
    try {
      const {
        projectType,
        minPrice,
        maxPrice,
        skills = '',
        deliveryDays,
        sort,
        search,
        page,
        experience
      } = req.query as any
      const { freelancerSkills } = req.body

      const { jobList, count } = await this.freelancerJobPostUseCase.getJobList(
        projectType,
        minPrice,
        maxPrice,
        skills,
        deliveryDays,
        sort,
        search,
        page,
        experience,
        freelancerSkills
      )
      res.status(200).json({ success: true, jobList, jobListCount: count })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async getJobDetails(req: Request, res: Response) {
    try {
      const { jobID } = req.body
      const jobDetails = await this.freelancerJobPostUseCase.getJobDetails(jobID)
      res.status(200).json({ success: true, jobDetails })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

}
