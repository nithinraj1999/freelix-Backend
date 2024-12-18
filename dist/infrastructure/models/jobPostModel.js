"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the JobPost schema
const jobPostSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId, // ObjectId type for referencing other documents
        ref: "User", // Reference to the 'User' model
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    file: {
        type: String,
    },
    skills: {
        type: [String],
        required: true, // Array of strings for skills
    },
    experience: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        required: true
    },
    fixedPrice: {
        type: Number,
        required: function () { return this.paymentType === 'fixed'; }
    },
    hourlyPrice: {
        from: {
            type: Number,
            required: function () { return this.paymentType === 'hourly'; }
        },
        to: {
            type: Number,
            required: function () { return this.paymentType === 'hourly'; }
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});
const jobPostModel = mongoose_1.default.model("JobPost", jobPostSchema);
exports.default = jobPostModel;
