import { IChatRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IChatRepository'
import { IChatUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IChatUseCase'
import { S3Bucket } from '../../../services/s3bucket'
export class ChatUseCase implements IChatUseCase {
    private chatRepository: IChatRepository

    constructor(chatRepository: IChatRepository) {
        this.chatRepository = chatRepository
    }

    async fetchAllContacts(userId: string) {
        try {
            const contacts = await this.chatRepository.fetchAllContacts(userId)
            return contacts
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async fetchChat(userId: string, contactId: string) {
        try {
            const chat = await this.chatRepository.fetchChat(userId, contactId)
            return chat
        } catch (error) {
            throw error
        }
    }

    async fileUpload(file: any) {
        try {
            let image = null
            if (file) {
                const { originalname, buffer, mimetype } = file
                const awsS3 = new S3Bucket()
                image = await awsS3.uploadProfilePic(
                    originalname,
                    buffer,
                    mimetype,
                    'chat-files'
                )
               if(image){
                return image
               }
            }
             
        } catch (error) {
            throw error
        }
    }

    // async downloadAttachment(url:string){

    // }
}
