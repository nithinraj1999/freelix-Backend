export interface IChatRepository{
    fetchAllContacts(userId: string):Promise<any>
    fetchChat(userId: string, contactId: string):Promise<any>
}