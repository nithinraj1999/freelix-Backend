"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = void 0;
const errorHandlingMiddleware = (err, req, res) => {
    // Log error details
    console.log("hhhh", req.method);
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;
