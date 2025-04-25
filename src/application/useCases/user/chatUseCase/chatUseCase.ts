import { IChatRepository } from '../../../../domain/interfaces/user/repositoryInterfaces/IChatRepository'
import { IChatUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IChatUseCase'

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
}
