import { IFreelancerRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerRepository'
import { S3Bucket } from '../../services/s3bucket'
import { IFreelancerSkillRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerSkillRepository'
import { IFreelancerUseCase } from '../../../domain/interfaces/freelancer/useCases/IFreelancerUseCase'

export class FreelancerUseCase implements IFreelancerUseCase {
    private freelancerRepository: IFreelancerRepository

    private freelancerSkillRepository:IFreelancerSkillRepository
    constructor(
        freelancerRepository: IFreelancerRepository,
        freelancerSkillRepository:IFreelancerSkillRepository
    ) {
        this.freelancerRepository = freelancerRepository
       
        this.freelancerSkillRepository = freelancerSkillRepository

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
            const data = await this.freelancerSkillRepository.getSkills()
            return data
        } catch (error) {
            throw error
        }
    }

}
