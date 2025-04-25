import { Request, Response } from 'express'
import { jwtInterface } from '../../../application/services/interfaces/jwtInterface'
import { IFreelancerUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerUseCase'
export class FreelancerController {
  constructor(
    private freelancerUseCase: IFreelancerUseCase,
    private jwt: jwtInterface
  ) {}

  async createFreelancerAccount(req: Request, res: Response) {
    try {
      const file = req.file
      const createFreelancer = await this.freelancerUseCase.createFreelancer(req.body, file)
      if (createFreelancer) {
        const freelancerData = await this.freelancerUseCase.findFreelancerById(req.body.userID)
        res.json({ success: true, freelancerData })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async switchToBuying(req: Request, res: Response) {
    try {
      const switchToBuying = await this.freelancerUseCase.switchToBuying(req.body.userID)
      if (switchToBuying) {
        const accessToken = await this.jwt.generateAccessToken({ _id: req.body.userID, role: 'client' })
        const refreshToken = await this.jwt.generateRefreshToken({ _id: req.body.userID, role: 'client' })

        res.cookie('userRefreshJWT', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const freelancerData = await this.freelancerUseCase.findFreelancerById(req.body.userID)
        res.json({ success: true, freelancerData, accessToken })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async switchToSelling(req: Request, res: Response) {
    try {
      const switchToSelling = await this.freelancerUseCase.switchToSelling(req.body.userID)
      if (switchToSelling) {
        const accessToken = await this.jwt.generateAccessToken({ _id: req.body.userID, role: 'freelancer' })
        const refreshToken = await this.jwt.generateRefreshToken({ _id: req.body.userID, role: 'freelancer' })

        res.cookie('userRefreshJWT', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const freelancerData = await this.freelancerUseCase.findFreelancerById(req.body.userID)
        res.json({ success: true, freelancerData, accessToken })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async editprofile(req: Request, res: Response) {
    try {
      const file = req.file
      const updatedProfile = await this.freelancerUseCase.editProfile(req.body, file)
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the profile'
      })
    }
  }

  async fetchFreelancerDetails(req: Request, res: Response) {
    try {
      const { freelancerId } = req.body
      const details = await this.freelancerUseCase.fetchFreelancerDetails(freelancerId)
      res.status(200).json({ success: true, freelancerDetails: details })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }

  async deletePortfolioImg(req: Request, res: Response) {
    try {
      const { imageId, userId, image } = req.body
      await this.freelancerUseCase.deletePortFolioImg(imageId, userId, image)
      res.status(200).json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false })
    }
  }


  async getSkills(req: Request, res: Response) {
    try {
        const skills = await this.freelancerUseCase.getSkills()
        res.json(skills)
    } catch (error) {
        console.error(error)
    }
}

    async dashboardData(req: Request, res: Response) {
        try {
            const { userId } = req.body
            const data = await this.freelancerUseCase.dashboardData(userId)
            res.json(data)
        } catch (error) {
            console.error(error)
        }
    }
}
