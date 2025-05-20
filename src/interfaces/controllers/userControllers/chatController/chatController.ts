import { Request, Response, NextFunction } from 'express'
import { IChatUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IChatUseCase'
import { S3Bucket } from '../../../../application/services/s3bucket'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

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

    async uploadFile(req: Request, res: Response) {
        try{
            const fileUpload = await this.chatUseCase.fileUpload(req.file)
            console.log(fileUpload);
            if(fileUpload){
                res.status(200).json({ success: true, fileUrl: fileUpload })
            }
        }catch(error){
            res.status(500).json({ success: false })
        }
    }

    async downloadAttachment(req: Request, res: Response){
        try{
        const {url} = req.body
          const file = url;
      
          const baseUrl = "https://freelixs3.s3.eu-north-1.amazonaws.com/";
          const fileKey = file.startsWith(baseUrl) ? file.replace(baseUrl, "") : file;
      
          const awsS3instance = new S3Bucket();
          const response: GetObjectCommandOutput = await awsS3instance.downloads3Object(fileKey);
      
          if (response.Body && response.Body instanceof Readable) {
            console.log(response.ContentType);
      
            res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
            res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
      
            response.Body.pipe(res);
          }
        }catch(error){
             res.status(500).json({ success: false })
        }

    }
}
 
