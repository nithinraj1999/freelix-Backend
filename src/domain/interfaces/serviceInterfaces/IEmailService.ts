export interface IEmailService{
    sendEmail(recipient:string,message:string):Promise<any>;
    sendEmailToResetPassword(email:string,resetLink:string):Promise<any>
}