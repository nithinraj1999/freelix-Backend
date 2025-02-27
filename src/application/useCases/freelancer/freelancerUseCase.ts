import { Ibcrypt } from '../../services/interfaces/bcryptInterface'
import { jwtInterface } from '../../services/interfaces/jwtInterface'
import { Cloudinary } from '../../services/cloudinary'

import { IFreelancerRepository } from '../../../infrastructure/repositories/interface/freelancerRepositoryInterface'
import { FreelancerUseCaseInterface } from '../interfaces/IFreelancerUseCase'
import { NotificationService } from '../../services/notificationService'
import { userSocketMap } from '../../services/socket'
import { IBid } from '../../../infrastructure/models/interface/IBidModel'
import { S3Bucket } from '../../services/s3bucket'


export class FreelancerUseCase implements FreelancerUseCaseInterface {
    private freelancerRepository: IFreelancerRepository
    private bcrypt: Ibcrypt
    private jwtToken: jwtInterface
    constructor(
        reelancerRepository: IFreelancerRepository,
        bcrypt: Ibcrypt,
        jwtToken: jwtInterface
    ) {
        this.freelancerRepository = reelancerRepository
        this.bcrypt = bcrypt
        this.jwtToken = jwtToken
    }

    async createFreelancer(data: any, file: any | null) {
        try {
            let image = null
            const {originalname,buffer,mimetype} =file
            console.log(originalname);
            
            if (file) {
                const awsS3instance = new S3Bucket()
                image = await awsS3instance.uploadProfilePic(
                    originalname,
                    buffer,
                    mimetype,
                  'profile-pics'
                )
                console.log(image)
            }
 
            const response =
                await this.freelancerRepository.createFreelancerAccount(
                    data,
                    image
                )
            return response
        } catch (error) {
            console.error(error)
        }
    }

    async findFreelancerById(id: string) {
        try {
            const freelancer =
                await this.freelancerRepository.findFreelancerById(id)
            return freelancer
        } catch (error) {
            console.error()
        }
    }

    async switchToBuying(userID: string) {
        try {
            const freelancer = await this.freelancerRepository.switchToBuying(
                userID
            )
            return freelancer
        } catch (error) {
            console.error()
        }
    }

    async switchToSelling(userID: string) {
        try {
            const freelancer = await this.freelancerRepository.switchToSelling(
                userID
            )
            return freelancer
        } catch (error) {
            console.error()
        }
    }

    async getJobList(
        projectType: string,
        minPrice: string,
        maxPrice: string,
        skills: any,
        deliveryDays: string,
        sort: string,
        search: string,
        page: string,
        experience: string,
        freelancerSkills: any
    ) {
        try {
            const jobList = await this.freelancerRepository.jobList(
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
            return jobList
        } catch (error) {
            console.error(error)
        }
    }
    async getJobListCount() {
        try {
            const jobListCount =
                await this.freelancerRepository.getJobListCount()
            return jobListCount
        } catch (error) {
            throw error
        }
    }

    async editProfile(data: any, file: any) {
        try {
            let image = null
           
            
            if (file) {
                const {originalname,buffer,mimetype} =file
                const awsS3instance = new S3Bucket()
                image = await awsS3instance.uploadProfilePic(
                    originalname,
                    buffer,
                    mimetype,
                  'portfolios'
                )
                console.log(image)
            }
 
            const jobList = await this.freelancerRepository.editProfile(
                data,
                image
            )

            return jobList
        } catch (error) {
            console.error(error)
        }
    }

    async getJobDetails(jobID: string) {
        try {
            const jobDetails = await this.freelancerRepository.jobDetails(jobID)
            return jobDetails
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async isBidderAlreadyExist(jobId: string, userId: string) {
        try {
            const isExistingBidder =
                await this.freelancerRepository.isExistingBidder(jobId, userId)
            return isExistingBidder
        } catch (error) {
            throw error
        }
    }

    async submitBid(
        jobId: string,
        freelancerId: string,
        bidAmount: string,
        deliveryDays: string,
        proposal: string
    ) {
        try {
            const bid = await this.freelancerRepository.submitBid(
                jobId,
                freelancerId,
                bidAmount,
                deliveryDays,
                proposal
            )

            const storednotification =
                await this.freelancerRepository.storeNotification(
                    bid.jobId.userID,
                    bid.freelancerId,
                    bid.freelancerId.name,
                    bid.createdAt,
                    bid.bidAmount
                )
            if (bid) {
                const clientSocketID = userSocketMap.get(
                    bid.jobId.userID.toString()
                )

                if (clientSocketID) {
                    await NotificationService.sendNewBidDetails(
                        clientSocketID,
                        bid
                    )
                    await NotificationService.sendNotification(
                        clientSocketID,
                        bid
                    )
                } else {
                    console.warn(
                        `No client socket ID found for user ${bid.jobId.userID}`
                    )
                }
            }
            return bid
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getAllBids(jobId: string) {
        try {
            const allBids = await this.freelancerRepository.getAllBids(jobId)
            return allBids
        } catch (error) {
            console.error(error)
        }
    }

    async editBid(data: Partial<IBid>) {
        try {
            const edit = await this.freelancerRepository.editBid(data)
            return edit
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async myBids(userId: string) {
        try {
            const myBids = await this.freelancerRepository.myBids(userId)
            return myBids
        } catch (error) {
            throw error
        }
    }

    async myBidDetails(bidID: string) {
        try {
            const myBidDetails = await this.freelancerRepository.myBidDetails(
                bidID
            )
            return myBidDetails
        } catch (error) {
            throw error
        }
    }

    async withdrawBid(bidId: string) {
        try {
            const withdraw = await this.freelancerRepository.withdrawBid(bidId)
            if (withdraw) {
                const id = withdraw.jobId.userID
                const clientSocketID = userSocketMap.get(id.toString())
                if (clientSocketID) {
                    await NotificationService.removeBid(clientSocketID, bidId)
                }
            }
            return withdraw
        } catch (error) {
            throw error
        }
    }

    async fetchFreelancerDetails(freelancerId: string) {
        try {
            const details =
                await this.freelancerRepository.getFreelancerDetails(
                    freelancerId
                )
            return details
        } catch (error) {
            throw error
        }
    }

    async deletePortFolioImg(imageId: string, userId: string,image:string) {
        try {

            if (image) {
                const awsS3instance = new S3Bucket()
                 await awsS3instance.deleteS3object(image)
            }
            const portfolioDelition =
                await this.freelancerRepository.deletePortFolioImg(
                    imageId,
                    userId
                )
            return portfolioDelition
        } catch (error) {
            throw error
        }
    }

    async getMyOrders(freelancrId: string) {
        try {
            const orders = await this.freelancerRepository.getMyOrders(
                freelancrId
            )
            return orders
        } catch (error) {
            throw error
        }
    }

    async completeOrder(orderId: string, description: string, file: any) {
        try {
            // let project: string | null = null
            let image = null
            
            if (file) {
                const {originalname,buffer,mimetype} =file
                console.log(originalname);
                const awsS3instance = new S3Bucket()
                image = await awsS3instance.uploadProfilePic(
                    originalname,
                    buffer,
                    mimetype,
                  'project-files'
                )
                console.log(image)
            }
            // if (file) {
            //     const cloudinaryInstance = new Cloudinary()
            //     const image = await cloudinaryInstance.uploadProfilePic(file)
            //     project = image.url
            // }
            // console.log('url', project)
            const completeOrder = await this.freelancerRepository.completeOrder(
                orderId,
                description,
                image
            )
            return completeOrder
        } catch (error) {
            throw error
        }
    }

    async fetchReviews(freelancerId: string) {
        try {
            const reviews = await this.freelancerRepository.fetchReviews(
                freelancerId
            )
            return reviews
        } catch (error) {
            throw error
        }
    }

    async fetchWallet(freelancerId: string) {
        try {
            const wallet = await this.freelancerRepository.fetchWallet(
                freelancerId
            )
            return wallet
        } catch (error) {
            throw error
        }
    }

    async dashboardData(userId: string) {
        try {
            const data = await this.freelancerRepository.dashboardData(userId)
            return data
        } catch (error) {
            throw error
        }
    }

    async getSkills() {
        try {
            const skills = await this.freelancerRepository.getSkills()
            return skills
        } catch (error) {
            throw error
        }
    }
}
