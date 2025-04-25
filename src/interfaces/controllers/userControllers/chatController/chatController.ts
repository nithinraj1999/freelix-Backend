import { Request, Response, NextFunction } from 'express'
import { IChatUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IChatUseCase'

export class ChatController {

    private chatUseCase: IChatUseCase
    constructor(chatUseCase: IChatUseCase) {
        this.chatUseCase = chatUseCase
    }

    async fetchAllContacts(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body
            const allContacts = await this.chatUseCase.fetchAllContacts(userId)
            res.status(200).json({ success: true, allContacts: allContacts })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    async fetchChat(req: Request, res: Response) {
        try {
            const { userId, contactId } = req.query
            const chat = await this.chatUseCase.fetchChat(
                userId as string,
                contactId as string
            )
            res.status(200).json({ success: true, chat: chat })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }
}
