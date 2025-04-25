import { IChatRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IChatRepository"
export class Chatrepository implements IChatRepository{

    private messageModel
    constructor(messageModel:any){
        this.messageModel = messageModel
    }


    async fetchAllContacts(userId: string) {
        try {
            const messages = await this.messageModel.find({
                $or: [{ senderId: userId }, { recipientId: userId }],
            })
                .populate('senderId', 'name')
                .populate('recipientId', 'name')
                .lean()

            // Extract unique contacts
            const contactMap = new Map<string, { id: string; name: string }>()
            messages.forEach((message:any) => {
                // Normalize senderId and recipientId
                const sender =
                    typeof message.senderId === 'string'
                        ? { _id: message.senderId, name: null }
                        : message.senderId
                const recipient =
                    typeof message.recipientId === 'string'
                        ? { _id: message.recipientId, name: null }
                        : message.recipientId

                // Add sender to the map
                if (sender._id !== userId) {
                    contactMap.set(sender._id.toString(), {
                        id: sender._id.toString(),
                        name: sender.name,
                    })
                }

                // Add recipient to the map
                if (recipient._id !== userId) {
                    contactMap.set(recipient._id.toString(), {
                        id: recipient._id.toString(),
                        name: recipient.name,
                    })
                }
            })

            // Convert Map to Array
            const contacts = Array.from(contactMap.values())
            console.log(contacts)

            return contacts
        } catch (error) {
            throw error
        }
    }


    async fetchChat(userId: string, contactId: string) {
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