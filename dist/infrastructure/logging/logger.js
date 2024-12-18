"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'error',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json() // Logs in structured JSON format
    ),
    transports: [
        new winston_1.transports.File({ filename: 'errors.log', level: 'error' }),
        new winston_1.transports.Console({ format: winston_1.format.simple() })
    ],
});
exports.default = logger;
