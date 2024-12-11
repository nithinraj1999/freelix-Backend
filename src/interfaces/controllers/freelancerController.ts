import { Request, Response } from 'express'
import { FreelancerUseCaseInterface } from '../../application/useCases/interfaces/IFreelancerUseCase'
import { Cloudinary } from '../../application/services/cloudinary'
import { jwtInterface } from '../../application/services/interfaces/jwtInterface'
import { S3Bucket } from '../../application/services/s3bucket'
export class FreelancerController {
    private freelancerUseCase: FreelancerUseCaseInterface
    private jwt: jwtInterface
    constructor(
        freelancerUseCase: FreelancerUseCaseInterface,
        jwt: jwtInterface
    ) {
        this.freelancerUseCase = freelancerUseCase
        this.jwt = jwt
    }

    async createFreelancerAccount(req: Request, res: Response) {
        try {
            const file = req.file

            // if (req.file) {
            //     const awsS3instance = new S3Bucket()
            //     const image = await awsS3instance.uploadProfilePic(
            //         req.file.originalname,
            //         req.file.path,
            //         req.file.mimetype,
            //         'profile-pics'
            //     )
            //     // console.log(image)
            // }

            const createFreelancer =
                await this.freelancerUseCase.createFreelancer(
                    req.body,
                    file
                )
            if (createFreelancer) {
                const freelancerData =
                    await this.freelancerUseCase.findFreelancerById(
                        req.body.userID
                    )
                res.json({ success: true, freelancerData })
            }
        } catch (error) {
            console.error(error)
        }
    }

    async switchToBuying(req: Request, res: Response) {
        try {
            const switchToBuying = await this.freelancerUseCase.switchToBuying(
                req.body.userID
            )
            if (switchToBuying) {
                const accessToken = await this.jwt.generateAccessToken({
                    _id: req.body.userID,
                    role: 'client',
                })

                const refreshToken = await this.jwt.generateRefreshToken({
                    _id: req.body.userID,
                    role: 'client',
                })

                res.cookie('userRefreshJWT', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })

                const freelancerData =
                    await this.freelancerUseCase.findFreelancerById(
                        req.body.userID
                    )
                res.json({
                    success: true,
                    freelancerData,
                    accessToken: accessToken,
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    async switchToSelling(req: Request, res: Response) {
        try {
            const switchToBuying = await this.freelancerUseCase.switchToSelling(
                req.body.userID
            )
            if (switchToBuying) {
                const accessToken = await this.jwt.generateAccessToken({
                    _id: req.body.userID,
                    role: 'freelancer',
                })

                const refreshToken = await this.jwt.generateRefreshToken({
                    _id: req.body.userID,
                    role: 'freelancer',
                })

                res.cookie('userRefreshJWT', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                const freelancerData =
                    await this.freelancerUseCase.findFreelancerById(
                        req.body.userID
                    )
                res.json({
                    success: true,
                    freelancerData,
                    accessToken: accessToken,
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getJobList(req: Request, res: Response) {
        try {
            const { freelancerSkills } = req.body
            console.log(freelancerSkills)

            const projectType = req.query.projectType as string
            const minPrice = req.query.minPrice as string
            const maxPrice = req.query.maxPrice as string
            const skills = (req.query.skills as string) || ''
            const deliveryDays = req.query.deliveryDays as string
            const sort = req.query.sort as string
            const search = req.query.search as string
            const page = req.query.page as string
            const experience = req.query.experience as string

            const jobListAndCount = await this.freelancerUseCase.getJobList(
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
            const jobListCount = await this.freelancerUseCase.getJobListCount()
            const { jobList, count } = jobListAndCount
            res.status(200).json({
                success: true,
                jobList: jobList,
                jobListCount: count,
            })
        } catch (error) {
            console.error()
        }
    }

    async editprofile(req: Request, res: Response) {
        console.log("port....",req.file);
        
        try {
            const file = req.file
            let firstFile: Express.Multer.File | null = null
            // if (files) {
            //     if (Array.isArray(files)) {
            //         firstFile = files[0] ?? null 
            //     } else {
            //         const fileArray = Object.values(files).flat() 
            //         firstFile = fileArray[0] ?? null 
            //     }
            // }
            console.log("portfolio...",firstFile);
            
            const updatedProfile = await this.freelancerUseCase.editProfile(
                req.body,
                file
            )

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedProfile,
            })
        } catch (error) {
            console.error('Error updating profile:', error)
            return res.status(500).json({
                success: false,
                message: 'An error occurred while updating the profile',
            })
        }
    }

    async getJobDetails(req: Request, res: Response) {
        try {
            const { jobID } = req.body
            const jobDetails = await this.freelancerUseCase.getJobDetails(jobID)

            return res.status(200).json({
                success: true,
                message: 'job details fetched successfully',
                jobDetails: jobDetails,
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: 'An error occurred while fetching job details',
            })
        }
    }

    async isExistingBidder(req: Request, res: Response) {
        try {
            const { jobId, userId } = req.body

            const isExistingBidder =
                await this.freelancerUseCase.isBidderAlreadyExist(jobId, userId)
            if (isExistingBidder) {
                res.json({ isExist: true })
            } else {
                res.json({ isExist: false })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
            })
        }
    }

    async submitBid(req: Request, res: Response) {
        try {
            const { jobId, freelancerId, bidAmount, deliveryDays, proposal } =
                req.body
            const isAlreadybid =
                await await this.freelancerUseCase.isBidderAlreadyExist(
                    jobId,
                    freelancerId
                )
            if (isAlreadybid) {
                res.json({ success: false, message: 'already bidded' })
            } else {
                const bid = await this.freelancerUseCase.submitBid(
                    jobId,
                    freelancerId,
                    bidAmount,
                    deliveryDays,
                    proposal
                )
                res.status(200).json({ success: true, bid: bid })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: 'An error occurred while submiting bid',
            })
        }
    }

    async getAllBids(req: Request, res: Response) {
        try {
            const { jobId } = req.body
            const allBids = await this.freelancerUseCase.getAllBids(jobId)
            res.status(200).json({ success: true, allBids: allBids })
        } catch (error) {
            res.json({ success: false })
            console.error()
        }
    }

    async editMyBid(req: Request, res: Response) {
        try {
            const data = req.body
            // console.log("mmm",req.body);

            const bidEdit = await this.freelancerUseCase.editBid(data)

            res.status(200).json({ success: true, editedBid: bidEdit })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async myBids(req: Request, res: Response) {
        try {
            const { userId } = req.body
            const myBids = await this.freelancerUseCase.myBids(userId)

            res.status(200).json({ success: true, myBids: myBids })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async myBidDetails(req: Request, res: Response) {
        try {
            const { bidID } = req.body
            const myBidDetails = await this.freelancerUseCase.myBidDetails(
                bidID
            )
            res.status(200).json({ success: true, myBidDetails: myBidDetails })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async withdrawBid(req: Request, res: Response) {
        try {
            const { bidId } = req.body
            console.log(bidId)

            const withdraw = await this.freelancerUseCase.withdrawBid(bidId)

            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async fetchFreelancerDetails(req: Request, res: Response) {
        try {
            console.log(req.body)
            const { freelancerId } = req.body
            const details = await this.freelancerUseCase.fetchFreelancerDetails(
                freelancerId
            )

            res.status(200).json({ success: true, freelancerDetails: details })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async deletePortfolioImg(req: Request, res: Response) {
        try {
            const { imageId,userId,image } = req.body
            const details = await this.freelancerUseCase.deletePortFolioImg(
                imageId,
                userId,
                image
            )

            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }
   
    async getMyOrders(req: Request, res: Response) {
        try {
            const { freelancerId } = req.body
            console.log(freelancerId)

            const myOrders = await this.freelancerUseCase.getMyOrders(
                freelancerId
            )
            res.json({ success: true, orders: myOrders })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching orders.',
            })
        }
    }

    async completeOrder(req: Request, res: Response) {
        try {
            const file = req.file 
            const { orderId, description } = req.body
            const completeOrder = await this.freelancerUseCase.completeOrder(
                orderId,
                description,
                file
            )
            res.json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: 'An error occurred .',
            })
        }
    }
    async fetchReviews(req: Request, res: Response) {
        try {
            const { freelancerId } = req.body
            const allReviews = await this.freelancerUseCase.fetchReviews(
                freelancerId
            )
            res.json({ success: true, allReviews: allReviews })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: 'An error occurred .',
            })
        }
    }

    async fetchWallet(req: Request, res: Response) {
        try {
            const { freelancerId } = req.body
            const wallet = await this.freelancerUseCase.fetchWallet(
                freelancerId
            )
            console.log(wallet)

            res.json({ success: true, wallet: wallet })
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

    async getSkills(req: Request, res: Response) {
        try {
            const skills = await this.freelancerUseCase.getSkills()
            res.json(skills)
        } catch (error) {
            console.error(error)
        }
    }
}
