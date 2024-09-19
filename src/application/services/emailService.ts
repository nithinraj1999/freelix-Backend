import { IEmailService } from "./interfaces/IEmailService";
import nodemailer from "nodemailer"

export class EmailService implements IEmailService{
    constructor(){}
    async sendEmail(recipient: string, message: string): Promise<any> {

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
          });
      
          let mailOptions = {
            from:process.env.MAIL_USER,
            to: recipient,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${message}`,
          };
          try {
            let info = await transporter.sendMail(mailOptions);
            return info;
            
          } catch (error) {
            throw error;
          }
    }
}

