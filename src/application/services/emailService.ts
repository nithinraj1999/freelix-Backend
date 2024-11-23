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
    async sendEmailToResetPassword(email: string, resetLink: string) {
    
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    
      // HTML-formatted email
      let mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your Reset Password Link",
        html: `
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" target="_blank" style="color: #1d4ed8; text-decoration: none;">Reset Password</a>
        `,
      };
    
      try {
        let info = await transporter.sendMail(mailOptions);
        return info;
      } catch (error) {
        throw error;
      }
    }
    

    
}

