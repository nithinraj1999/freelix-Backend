import { IChatRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IChatRepository"
import { Chat } from "../../../domain/entities/chat"

export class Chatrepository implements IChatRepository{

    private messageModel
    constructor(messageModel:any){
        this.messageModel = messageModel
    }


    async fetchAllContacts(userId: string): Promise<{ id: string; name: string }[]>  {
        try {
            const messages = await this.messageModel.find({
                $or: [{ senderId: userId }, { recipientId: userId }],
            })
                .populate('senderId', 'name')
                .populate('recipientId', 'name')
                .lean()

            const contactMap = new Map<string, { id: string; name: string }>()
            messages.forEach((message:any) => {
                const sender =
                    typeof message.senderId === 'string'
                        ? { _id: message.senderId, name: null }
                        : message.senderId
                const recipient =
                    typeof message.recipientId === 'string'
                        ? { _id: message.recipientId, name: null }
                        : message.recipientId

                if (sender._id !== userId) {
                    contactMap.set(sender._id.toString(), {
                        id: sender._id.toString(),
                        name: sender.name,
                    })
                }

                if (recipient._id !== userId) {
                    contactMap.set(recipient._id.toString(), {
                        id: recipient._id.toString(),
                        name: recipient.name,
                    })
                }
            })

            const contacts = Array.from(contactMap.values())

            return contacts
        } catch (error) {
            throw error
        }
    }


    async fetchChat(userId: string, contactId: string):Promise<Chat> {
        try {
            const chat = await this.messageModel.find({
                $or: [
                    { senderId: userId, recipientId: contactId },
                    { senderId: contactId, recipientId: userId },
                ],
            }).sort({ createdAt: 1 })

            return chat
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}