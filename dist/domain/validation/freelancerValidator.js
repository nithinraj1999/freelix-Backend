"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editBidSumissionSchema = exports.bidSumissionSchema = exports.editProfileSchema = exports.becomeFreelancerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.becomeFreelancerSchema = joi_1.default.object({
    userID: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    name: joi_1.default.string().pattern(/^\S.*\S$/).required(),
    description: joi_1.default.string().pattern(/^\S.*\S$/).required(),
    skills: joi_1.default.string().pattern(/^\S.*\S$/).required(),
    languages: joi_1.default.string().pattern(/^\S.*\S$/).required()
});
exports.editProfileSchema = joi_1.default.object({
    userID: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    name: joi_1.default.string().pattern(/^[a-zA-Z\s]*$/).min(1).optional(),
    title: joi_1.default.string().pattern(/^\S.*\S$/).optional(),
    description: joi_1.default.string().optional(),
    skills: joi_1.default.array().items(joi_1.default.string().pattern(/^\S.*\S$/)).optional(),
    file: joi_1.default.string().optional(), // Optional file
    portfolio: joi_1.default.array().items(joi_1.default.object({
        image: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().optional(),
    })).optional(),
});
exports.bidSumissionSchema = joi_1.default.object({
    jobId: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).required(),
    freelancerId: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    bidAmount: joi_1.default.number().positive().required(),
    deliveryDays: joi_1.default.number().positive().required(),
    proposal: joi_1.default.string().pattern(/^\S.*\S$/).required(),
});
exports.editBidSumissionSchema = joi_1.default.object({
    _id: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).optional(),
    freelancerId: joi_1.default.string().pattern(/^[a-fA-F0-9]{24}$/).optional(), // userID is required
    bidAmount: joi_1.default.number().positive().optional(),
    deliveryDays: joi_1.default.number().positive().optional(),
    proposal: joi_1.default.string().pattern(/^\S.*\S$/).optional(),
});
