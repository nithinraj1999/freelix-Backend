"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Bucket = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const promises_1 = __importDefault(require("fs/promises"));
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const getKeyFromUrl = (url) => {
    const baseUrl = 'https://freelixs3.s3.eu-north-1.amazonaws.com/';
    return url.replace(baseUrl, '');
};
class S3Bucket {
    constructor() {
        this.uploadProfilePic = (originalname, path, fileType, folder) => __awaiter(this, void 0, void 0, function* () {
            const bucketName = process.env.AWS_BUCKET_NAME;
            const key = `${folder}/${Date.now()}-${originalname}`;
            const buffer = yield promises_1.default.readFile(path);
            try {
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                    Body: buffer,
                    ContentType: fileType,
                });
                yield s3.send(command);
                const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
                return fileUrl;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
        this.deleteS3object = (fileName) => __awaiter(this, void 0, void 0, function* () {
            const file = getKeyFromUrl(fileName);
            const bucketName = process.env.AWS_BUCKET_NAME;
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: bucketName,
                Key: file,
            });
            const response = yield s3.send(command);
            return response;
        });
        this.downloads3Object = (fileName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.AWS_BUCKET_NAME;
                const file = getKeyFromUrl(fileName);
                const command = new client_s3_1.GetObjectCommand({
                    Bucket: bucketName,
                    Key: file,
                });
                const response = yield s3.send(command);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.S3Bucket = S3Bucket;
