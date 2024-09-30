import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { ICloudinary } from './interfaces/ICloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export class Cloudinary implements ICloudinary{
    constructor(){}

     uploadProfilePic = async (filePath: string) => {
        return cloudinary.uploader.upload(filePath, {
          folder: 'profile_pics',
        });
      };
}


