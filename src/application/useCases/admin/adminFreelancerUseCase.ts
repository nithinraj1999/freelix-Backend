import { IAdminFreelancerRepository } from "../../../domain/interfaces/admin/repository/IAdminFreelancerRepository"
import { Ibcrypt } from "../../../domain/interfaces/serviceInterfaces/bcryptInterface"
import { S3Bucket } from "../../services/s3bucket"
import { User } from "../../../domain/entities/user"
import { IAdminFreelancerUseCase } from "../../../domain/interfaces/admin/useCases/IAdminFreelancerUseCase"
export class AdminFreelancerUseCase implements IAdminFreelancerUseCase{
    constructor(
      private adminFreelancerRepository: IAdminFreelancerRepository,
      private bcrypt: Ibcrypt,
    ) {}
  
    getFreelancerData() {
      return this.adminFreelancerRepository.getAllFreelancerData()
    }
  
    blockFreelancer(id: string) {
      return this.adminFreelancerRepository.blockFreelancer(id)
    }
  
    unblockFreelancer(id: string) {
      return this.adminFreelancerRepository.unblockFreelancer(id)
    }
    async createFreelancer(data: User, profilePic: any) {
      try {
          let profileUrl: string | null = null

          if (profilePic) {
              const { originalname, buffer, mimetype } = profilePic

              const awsS3instance = new S3Bucket()
              profileUrl = await awsS3instance.uploadProfilePic(
                  originalname,
                  buffer,
                  mimetype,
                  'profile-pics'
              )
          }

          if (data.password) {
              const hashedPassword = await this.bcrypt.hash(data.password)
              const response = await this.adminFreelancerRepository.createFreelancer(
                  data,
                  profileUrl,
                  hashedPassword
              )
              return response
          }
      } catch (error) {
          console.error(error)
          throw new Error('Failed to create freelancer')
      }
  }
  
  async editFreelancer(data: User, profilePic: any) {
    try {
        let profileUrl: string | null = null

        if (profilePic) {
            const { originalname, buffer, mimetype } = profilePic

            const awsS3instance = new S3Bucket()
            profileUrl = await awsS3instance.uploadProfilePic(
                originalname,
                buffer,
                mimetype,
                'profile-pics'
            )
        }
        const response = await this.adminFreelancerRepository.editFreelancer(
            data,
            profileUrl
        )
        return response
    } catch (error) {
        console.error(error)
        throw new Error('Failed to edit freelancer')
    }
}  }
  