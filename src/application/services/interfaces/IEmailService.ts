export interface IEmailService{
    sendEmail(recipient:string,message:string):Promise<any>;
}