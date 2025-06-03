import { Chat } from "../../../entities/chat";

export interface IChatRepository{
    fetchAllContacts(userId: string):Promise<{ id: string; name: string }[]>
    fetchChat(userId: string, contactId: string):Promise<Chat>
}