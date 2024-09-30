import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Configure Multer to use disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Specify the directory to save the files
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the original name and current timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use the original file extension
  },
});

// Initialize Multer with the configured storage
export const upload = multer({
  storage: storage, // Use disk storage
  limits: { fileSize: 1024 * 1024 * 5 }, // Optional: limit file size to 5MB
  fileFilter: (req, file, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept only image files
    } else {
      cb(new Error('Only images are allowed') as any, false); // Reject non-image files
    }
  },
});



