"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = void 0;
const logger_1 = __importDefault(require("../../infrastructure/logging/logger"));
const errorHandlingMiddleware = (err, req, res) => {
    // Log error details
    console.log("hhhh", req.method);
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;
