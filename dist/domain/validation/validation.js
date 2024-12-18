"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editJobPostSchema = exports.loginSchema = exports.jobCreationSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().pattern(/^\S.*\S$/).required(),
    password: joi_1.default.string().min(6).pattern(/^\S.*\S$/).required(),
    confirmPassword: joi_1.default.string().min(4).pattern(/^\S.*\S$/).required(),
    name: joi_1.default.string().pattern(/^\S.*\S$/).min(1).required(),
    phone: joi_1.default.string().length(10).pattern(/^[0-9]+$/).required()
});
exports.jobCreationSchema = joi_1.default.object({
    title: joi_1.default.string().pattern(/^\S.*\S$/).required(),
    paymentType: joi_1.default.string().valid('fixed', 'hourly').required(),
    experience: joi_1.default.string().pattern(/^\S.*\S$/).required(),
    description: joi_1.default.string().pattern(/^\S.*\S$/).required(),
    userID: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).required(),
    skills: joi_1.default.string().pattern(/^\S.*\S$/).required().min(1).required(),
    file: joi_1.default.string().optional(),
    fixedPrice: joi_1.default.number().positive().optional(),
    hourlyPrice: joi_1.default.object({
        from: joi_1.default.number().positive().required(),
        to: joi_1.default.number().positive().greater(joi_1.default.ref('from')).required(),
    }).optional(),
}).xor('fixedPrice', 'hourlyPrice');
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().pattern(/^\S.*\S$/).required(),
    password: joi_1.default.string().min(4).pattern(/^\S.*\S$/).required(),
});
exports.editJobPostSchema = joi_1.default.object({
    _id: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).optional(),
    title: joi_1.default.string().pattern(/^\S.*\S$/).optional(),
    paymentType: joi_1.default.string().valid('fixed', 'hourly').optional(),
    experience: joi_1.default.string().pattern(/^\S.*\S$/).optional(),
    description: joi_1.default.string().pattern(/^\S.*\S$/).optional(),
    userID: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).optional(),
    skills: joi_1.default.array()
        .optional(), // Make optional    file:Joi.string().optional(),
    totalAmount: joi_1.default.number().positive().optional(),
    hourlyPrice: joi_1.default.object({
        from: joi_1.default.number().positive().optional(),
        to: joi_1.default.number().positive().greater(joi_1.default.ref('from')).required(),
    }).optional(),
});
