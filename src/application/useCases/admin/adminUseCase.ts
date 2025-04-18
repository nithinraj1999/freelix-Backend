import { IAdminRepository } from '../../../infrastructure/repositories/interface/adminRepositoryInterface'
import { Ibcrypt } from '../../services/interfaces/bcryptInterface'
import { IAdminUseCase } from '../interfaces/IAdminUseCase'
import { jwtInterface } from '../../services/interfaces/jwtInterface'
import { Cloudinary } from '../../services/cloudinary'
import { User } from '../../../domain/entities/user'
import { S3Bucket } from '../../services/s3bucket'
export class AdminUseCase implements IAdminUseCase {
    private adminRepository: IAdminRepository
    private bcrypt: Ibcrypt
    private jwtToken: jwtInterface
    constructor(
        adminRepository: IAdminRepository,
        bcrypt: Ibcrypt,
        jwtToken: jwtInterface
    ) {
        this.adminRepository = adminRepository
        this.bcrypt = bcrypt
        this.jwtToken = jwtToken
    }

    async authenticateAdmin(email: string, password: string) {
        try {
            const user = await this.adminRepository.findByEmail(email)
            if (user) {
                if (user.password) {
                    const hashedPassword = user.password
                    const isPasswordValid = await this.bcrypt.compare(
                        password,
                        hashedPassword
                    )
                    if (isPasswordValid) {
                        return user
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getClientData(skip: number, limit: number) {
        try {
            const clients = await this.adminRepository.getAllClientData(
                skip,
                limit
            )
            return clients
        } catch (error) {
            console.error(error)
        }
    }

    async getTotalClients() {
        try {
            const totalClients = await this.adminRepository.totalClients()
            return totalClients
        } catch (error) {
            console.error(error)
        }
    }
    async blockClient(clientID: string) {
        try {
            const response = await this.adminRepository.blockClient(clientID)
            return response
        } catch (error) {
            console.error(error)
        }
    }

    async unblockClient(clientID: string) {
        try {
            const response = await this.adminRepository.unblockClient(clientID)
            return response
        } catch (error) {
            console.error(error)
        }
    }

    async createUser(data: User, profilePic: any) {
        try {
            let profileUrl: string | null = null

            // if (profilePic) {
            //   const cloudinaryInstance = new Cloudinary();
            //   const image = await cloudinaryInstance.uploadProfilePic(profilePic);
            //   profileUrl = image.url; // Get the image URL from Cloudinary
            // }

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
                const response = await this.adminRepository.createUser(
                    data,
                    profileUrl,
                    hashedPassword
                )
                return response
            }

            // Call the repository to create the user, passing the profileUrl (can be null)
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

            const response = await this.adminRepository.editUser(
                data,
                profileUrl
            )
            return response
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create user')
        }
    }

    async getFreelancerData() {
        try {
            const freelancers =
                await this.adminRepository.getAllFreelancerData()
            return freelancers
        } catch (error) {
            console.error(error)
            throw new Error('Failed to retrieve freelancers') // Optional: Rethrow with a message
        }
    }
    // Block a freelancer
    async blockFreelancer(freelancerID: string) {
        try {
            const response = await this.adminRepository.blockFreelancer(
                freelancerID
            )
            return response
        } catch (error) {
            console.error(error)
            throw new Error('Failed to block freelancer')
        }
    }

    // Unblock a freelancer
    async unblockFreelancer(freelancerID: string) {
        try {
            const response = await this.adminRepository.unblockFreelancer(
                freelancerID
            )
            return response
        } catch (error) {
            console.error(error)
            throw new Error('Failed to unblock freelancer')
        }
    }

    // Create a freelancer
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
                const response = await this.adminRepository.createFreelancer(
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

    // Edit a freelancer
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
            const response = await this.adminRepository.editFreelancer(
                data,
                profileUrl
            )
            return response
        } catch (error) {
            console.error(error)
            throw new Error('Failed to edit freelancer')
        }
    }

    async addSkills(skill: string, description: string) {
        try {
            const skills = await this.adminRepository.addSkills(
                skill,
                description
            )
            return skills
        } catch (error) {
            throw error
        }
    }

    async getDashboardData() {
        try {
            const data = await this.adminRepository.getDashboardData()
            return data
        } catch (error) {
            throw error
        }
    }

    async getAllSkills() {
        try {
            const skills = await this.adminRepository.getAllSkills()
            return skills
        } catch (error) {
            throw error
        }
    }
}
