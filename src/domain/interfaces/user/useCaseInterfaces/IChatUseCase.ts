export interface IChatUseCase{
    fetchAllContacts(userId:string):Promise<any>
    fetchChat(userId:string,contactId:string):Promise<any>
}