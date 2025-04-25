import { Request, Response, NextFunction } from 'express'
import { IOrderUseCase } from '../../../../domain/interfaces/user/useCaseInterfaces/IOrderUseCase'
import { S3Bucket } from '../../../../application/services/s3bucket'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream'; // Node.js stream module

export class OrderController {

    private orderUseCase:IOrderUseCase
    
    constructor(orderUseCase:IOrderUseCase) {
        this.orderUseCase = orderUseCase
    }

    async getAllHiring(req: Request, res: Response,next:NextFunction) {
        try {
            const { clientId } = req.body
            const allHirings = await this.orderUseCase.getAllHirings(clientId)
            if (allHirings) {
                res.status(200).json({ success: true, allHirings: allHirings })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No hirings found',
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false })
        }
    }

    
      async  downloadFile(req: Request, res: Response): Promise<void> {
        try {
          const { orderId } = req.body;
    
          const deliverable = await this.orderUseCase.getDeliverable(orderId);
          const file = deliverable.delivery.fileUrl;
      
          const baseUrl = "https://freelixs3.s3.eu-north-1.amazonaws.com/";
          const fileKey = file.startsWith(baseUrl) ? file.replace(baseUrl, "") : file;
      
          const awsS3instance = new S3Bucket();
          const response: GetObjectCommandOutput = await awsS3instance.downloads3Object(fileKey);
      
          if (response.Body && response.Body instanceof Readable) {
            console.log(response.ContentType);
      
            res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
            res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
      
            response.Body.pipe(res);
          } else {
            res.status(400).json({ success: false, message: "File not found or unable to retrieve file" });
          }
      
      
        } catch (error) {
          console.error("Error while downloading", error);
          res.status(500).json({ success: false, message: "Internal server error." });
        }
      }
      
}
