export interface IChatUseCase{
    fetchAllContacts(userId:string):Promise<any>
    fetchChat(userId:string,contactId:string):Promise<any>
    fileUpload(file:any):Promise<any>
    // downloadAttachment(url:string):Promise<any>
}