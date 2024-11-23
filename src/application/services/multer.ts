import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use the original file extension
  },
});

export const upload = multer({
  storage: storage, // Use disk storage
  limits: {
    fileSize: 10 * 1024 * 1024, 
    fieldSize: 10 * 1024 * 1024, // Maximum size for text fields: 10 MB
    fields: 10, // Maximum number of non-file fields allowed
    files: 1, // Maximum number of files allowed in the request
  },
  fileFilter: (req, file, cb: FileFilterCallback) => {
   
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Only images, PDFs, and ZIP files are allowed') as any, false); // Reject non-allowed files
    }

  },
});



