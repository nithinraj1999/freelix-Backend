import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3'
import { IS3bucket } from './interfaces/IS3bucket'



const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

const getKeyFromUrl = (url: string): string => {
    const baseUrl = 'https://freelixs3.s3.eu-north-1.amazonaws.com/'
    return url.replace(baseUrl, '')
}

export class S3Bucket implements IS3bucket {
    constructor() {}
    uploadProfilePic = async (
        originalname: string,
        buffer: string,
        fileType: string,
        folder: string
    ) => {
        const bucketName = process.env.AWS_BUCKET_NAME
        const key = `${folder}/${Date.now()}-${originalname}`

        const creds = await s3.config.credentials();
        console.log("Resolved creds at runtime:", creds);
        
        
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: buffer,
                ContentType: fileType,
            })
            await s3.send(command)
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
            return fileUrl
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    deleteS3object = async (fileName: string) => {
        const file = getKeyFromUrl(fileName)
        const bucketName = process.env.AWS_BUCKET_NAME
        const command: DeleteObjectCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: file,
        })
        const response = await s3.send(command)
        return response
    }

    downloads3Object = async (fileName: string) => {
        try {
            const bucketName = process.env.AWS_BUCKET_NAME
            const file = getKeyFromUrl(fileName)
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: file,
            })

            const response = await s3.send(command)
            return response
        } catch (error) {
            throw error
        }
    }
}
