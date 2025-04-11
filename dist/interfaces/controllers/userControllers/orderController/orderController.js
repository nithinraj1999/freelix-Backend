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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const s3bucket_1 = require("../../../../application/services/s3bucket");
const stream_1 = require("stream"); // Node.js stream module
class OrderController {
    constructor(orderUseCase) {
        this.orderUseCase = orderUseCase;
    }
    getAllHiring(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId } = req.body;
                const allHirings = yield this.orderUseCase.getAllHirings(clientId);
                if (allHirings) {
                    res.status(200).json({ success: true, allHirings: allHirings });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: 'No hirings found',
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    downloadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                const deliverable = yield this.orderUseCase.getDeliverable(orderId);
                const file = deliverable.delivery.fileUrl;
                const baseUrl = "https://freelixs3.s3.eu-north-1.amazonaws.com/";
                const fileKey = file.startsWith(baseUrl) ? file.replace(baseUrl, "") : file;
                const awsS3instance = new s3bucket_1.S3Bucket();
                const response = yield awsS3instance.downloads3Object(fileKey);
                if (response.Body && response.Body instanceof stream_1.Readable) {
                    console.log(response.ContentType);
                    res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
                    res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
                    response.Body.pipe(res);
                }
                else {
                    res.status(400).json({ success: false, message: "File not found or unable to retrieve file" });
                }
            }
            catch (error) {
                console.error("Error while downloading", error);
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        });
    }
}
exports.OrderController = OrderController;
