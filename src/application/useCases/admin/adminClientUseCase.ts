import { IAdminUserRepository } from "../../../domain/interfaces/admin/repository/IAdminUserRepository"
import { User } from "../../../domain/entities/user"
import { S3Bucket } from "../../services/s3bucket"
import { Ibcrypt } from "../../../domain/interfaces/serviceInterfaces/bcryptInterface"
import { IAdminClientUseCase } from "../../../domain/interfaces/admin/useCases/IAdminClientUseCase"

export class AdminClientUseCase implements IAdminClientUseCase{
      private bcrypt: Ibcrypt
  
    constructor(private adminUserRepository: IAdminUserRepository,bcrypt: Ibcrypt) {
      this.bcrypt = bcrypt
    }
  
    getClientData(skip: number, limit: number) {
      return this.adminUserRepository.getAllClientData(skip, limit)
    }
  
    getTotalClients() {
      return this.adminUserRepository.totalClients()
    }
  
    blockClient(clientID: string) {
      return this.adminUserRepository.blockClient(clientID)
    }
  
    unblockClient(clientID: string) {
      return this.adminUserRepository.unblockClient(clientID)
    }

    
        async createUser(data: User, profilePic: any) {
            try {
                let profileUrl: string | null = null
        
                if (profilePic) {
                    const { originalname, buffer, mimetype } = profilePic
                    console.log(originalname)
                    const awsS3instance = new S3Bucket()
                    profileUrl = await awsS3instance.uploadProfilePic(
                        originalname,
                        buffer,
                        mimetype,
                        'profile-pics'
                    )
                    console.log(profileUrl)
                }
    
                if (data.password) {
                    const hashedPassword = await this.bcrypt.hash(data.password)
                    const response = await this.adminUserRepository.createUser(
                        data,
                        profileUrl,
                        hashedPassword
                    )
                    return response
                }
    
            } catch (error) {
                console.error(error)
                throw new Error('Failed to create user')
            }
        }

        
    async editUser(data: User, profilePic: any) {
      try {
          let profileUrl: string | null = null

          if (profilePic) {
              const { originalname, buffer, mimetype } = profilePic
              console.log(originalname)
              const awsS3instance = new S3Bucket()
              profileUrl = await awsS3instance.uploadProfilePic(
                  originalname,
                  buffer,
                  mimetype,
                  'profile-pics'
              )
          }

          const response = await this.adminUserRepository.editUser(
              data,
              profileUrl
          )
          return response
      } catch (error) {
          console.error(error)
          throw new Error('Failed to create user')
      }
  }
  }
  