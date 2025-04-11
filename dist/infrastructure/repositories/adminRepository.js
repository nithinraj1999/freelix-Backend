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
exports.AdminRepository = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const skillsModel_1 = __importDefault(require("../models/skillsModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const jobPostModel_1 = __importDefault(require("../models/jobPostModel"));
const escrow_1 = __importDefault(require("../models/escrow"));
const wallet_1 = __importDefault(require("../models/wallet"));
class AdminRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email: email, isAdmin: true });
            if (!user)
                return null;
            return user;
        });
    }
    getAllClientData(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield userModel_1.default.find({ isAdmin: false }).skip(skip).limit(limit);
            if (!clients)
                return null;
            return clients;
        });
    }
    totalClients() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalClients = yield userModel_1.default.countDocuments({
                    role: { $ne: "admin" }
                });
                return totalClients;
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockClient(clientID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("repo", clientID);
                const client = yield userModel_1.default.updateOne({ _id: clientID }, { $set: { isBlock: true } });
                return client;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    unblockClient(clientID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield userModel_1.default.updateOne({ _id: clientID }, { $set: { isBlock: false } });
                return client;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createUser(data, profileUrl, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone } = data;
                const newUser = {
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashedPassword,
                    isVerified: true
                };
                // Only add profilePicture if profileUrl is not null
                if (profileUrl) {
                    newUser["profilePicture"] = profileUrl;
                }
                const response = yield userModel_1.default.create(newUser);
                return response;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editUser(data, profileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, _id } = data;
                const user = {};
                if (name) {
                    user.name = name;
                }
                if (email) {
                    user.email = email;
                }
                if (phone) {
                    user.phone = phone;
                }
                if (profileUrl) {
                    user.profilePicture = profileUrl;
                }
                const response = yield userModel_1.default.updateOne({ _id: _id }, { $set: user });
                return response;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllFreelancerData() {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield userModel_1.default.find({ isAdmin: false, hasFreelancerAccount: true });
            if (!clients)
                return null;
            return clients;
        });
    }
    // Block a freelancer
    blockFreelancer(freelancerID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield userModel_1.default.updateOne({ _id: freelancerID }, { $set: { isFreelancerBlock: true } });
                return freelancer;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to block freelancer");
            }
        });
    }
    // Unblock a freelancer
    unblockFreelancer(freelancerID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield userModel_1.default.updateOne({ _id: freelancerID }, { $set: { isFreelancerBlock: false } });
                return freelancer;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to unblock freelancer");
            }
        });
    }
    // Create a freelancer
    createFreelancer(data, profileUrl, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, description, skills, languages } = data;
                const skillsArray = Array.isArray(skills)
                    ? skills
                    : typeof skills === 'string'
                        ? JSON.parse(skills)
                        : [];
                const languageArray = Array.isArray(languages)
                    ? languages
                    : typeof languages === 'string'
                        ? JSON.parse(languages)
                        : [];
                const newFreelancer = {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    isVerified: true,
                    description,
                    skills: skillsArray,
                    hasFreelancerAccount: true,
                    languages: languageArray, // Assuming languages is an array
                };
                // Only add profilePicture if profileUrl is not null
                if (profileUrl) {
                    newFreelancer["profilePicture"] = profileUrl;
                }
                const response = yield userModel_1.default.create(newFreelancer);
                return response;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to create freelancer");
            }
        });
    }
    // Edit a freelancer
    editFreelancer(data, profileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, description, skills, languages, _id } = data;
                const skillsArray = Array.isArray(skills)
                    ? skills
                    : typeof skills === 'string'
                        ? JSON.parse(skills) // Use JSON.parse to convert the string into an array
                        : []; // Default to an empty array if skills is undefined or not a string
                const languageArray = Array.isArray(languages)
                    ? languages
                    : typeof languages === 'string'
                        ? JSON.parse(languages) // Use JSON.parse to convert the string into an array
                        : []; // Default to an empty array if skills is undefined or not a string
                const freelancerUpdate = {};
                // Update only the provided fields
                if (name) {
                    freelancerUpdate.name = name;
                }
                if (email) {
                    freelancerUpdate.email = email;
                }
                if (phone) {
                    freelancerUpdate.phone = phone;
                }
                if (description) {
                    freelancerUpdate.description = description;
                }
                if (skills) {
                    freelancerUpdate.skills = skillsArray;
                }
                if (languages) {
                    freelancerUpdate.languages = languageArray;
                }
                if (profileUrl) {
                    freelancerUpdate.profilePicture = profileUrl;
                }
                const response = yield userModel_1.default.updateOne({ _id: _id }, { $set: freelancerUpdate });
                return response;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to edit freelancer");
            }
        });
    }
    addSkills(skill, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield skillsModel_1.default.create({
                    skill: skill,
                    description: description
                });
                return skills;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenueData = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            status: "Completed",
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$total" },
                            totalEarnings: {
                                $sum: {
                                    $multiply: ["$total", 0.3]
                                }
                            },
                        },
                    },
                ]);
                const totalFreelancers = yield userModel_1.default.countDocuments({ hasFreelancerAccount: true });
                const totalJobPost = yield jobPostModel_1.default.countDocuments();
                const escrowBalance = yield escrow_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            escrowBalance: { $sum: "$amount" },
                        },
                    },
                ]);
                const walletAmount = yield wallet_1.default.findOne({ isAdmin: true }, { balance: 1, _id: 0 });
                const monthlyRevenue = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            status: "Completed",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            orderDate: 1,
                            total: 1,
                        },
                    },
                ]);
                return { revenueData, totalFreelancers, totalJobPost, escrowBalance, walletAmount, monthlyRevenue };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield skillsModel_1.default.find();
                return skills;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
