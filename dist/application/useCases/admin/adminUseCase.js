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
exports.AdminUseCase = void 0;
const cloudinary_1 = require("../../services/cloudinary");
class AdminUseCase {
    constructor(adminRepository, bcrypt, jwtToken) {
        this.adminRepository = adminRepository;
        this.bcrypt = bcrypt;
        this.jwtToken = jwtToken;
    }
    authenticateAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.adminRepository.findByEmail(email);
                if (user) {
                    if (user.password) {
                        const hashedPassword = user.password;
                        const isPasswordValid = yield this.bcrypt.compare(password, hashedPassword);
                        if (isPasswordValid) {
                            return user;
                        }
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getClientData(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this.adminRepository.getAllClientData(skip, limit);
                return clients;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getTotalClients() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalClients = yield this.adminRepository.totalClients();
                return totalClients;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    blockClient(clientID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.blockClient(clientID);
                return response;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    unblockClient(clientID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.unblockClient(clientID);
                return response;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createUser(data, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profileUrl = null;
                // If profilePic is provided, upload it to Cloudinary
                if (profilePic) {
                    const cloudinaryInstance = new cloudinary_1.Cloudinary();
                    const image = yield cloudinaryInstance.uploadProfilePic(profilePic);
                    profileUrl = image.url; // Get the image URL from Cloudinary
                }
                // Hash the user's password
                if (data.password) {
                    const hashedPassword = yield this.bcrypt.hash(data.password);
                    const response = yield this.adminRepository.createUser(data, profileUrl, hashedPassword);
                    return response;
                }
                // Call the repository to create the user, passing the profileUrl (can be null)
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to create user");
            }
        });
    }
    editUser(data, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profileUrl = null;
                if (profilePic) {
                    const cloudinaryInstance = new cloudinary_1.Cloudinary();
                    const image = yield cloudinaryInstance.uploadProfilePic(profilePic);
                    profileUrl = image.url; // Get the image URL from Cloudinary
                }
                // Call the repository to create the user, passing the profileUrl (can be null)
                const response = yield this.adminRepository.editUser(data, profileUrl);
                return response;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to create user");
            }
        });
    }
    getFreelancerData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancers = yield this.adminRepository.getAllFreelancerData();
                return freelancers;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to retrieve freelancers"); // Optional: Rethrow with a message
            }
        });
    }
    // Block a freelancer
    blockFreelancer(freelancerID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.blockFreelancer(freelancerID);
                return response;
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
                const response = yield this.adminRepository.unblockFreelancer(freelancerID);
                return response;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to unblock freelancer");
            }
        });
    }
    // Create a freelancer
    createFreelancer(data, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profileUrl = null;
                // If profilePic is provided, upload it to Cloudinary
                if (profilePic) {
                    const cloudinaryInstance = new cloudinary_1.Cloudinary();
                    const image = yield cloudinaryInstance.uploadProfilePic(profilePic);
                    profileUrl = image.url; // Get the image URL from Cloudinary
                }
                // Hash the freelancer's password
                if (data.password) {
                    const hashedPassword = yield this.bcrypt.hash(data.password);
                    const response = yield this.adminRepository.createFreelancer(data, profileUrl, hashedPassword);
                    return response;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to create freelancer");
            }
        });
    }
    // Edit a freelancer
    editFreelancer(data, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profileUrl = null;
                if (profilePic) {
                    const cloudinaryInstance = new cloudinary_1.Cloudinary();
                    const image = yield cloudinaryInstance.uploadProfilePic(profilePic);
                    profileUrl = image.url; // Get the image URL from Cloudinary
                }
                // Call the repository to edit the freelancer, passing the profileUrl (can be null)
                const response = yield this.adminRepository.editFreelancer(data, profileUrl);
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
                const skills = yield this.adminRepository.addSkills(skill, description);
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
                const data = yield this.adminRepository.getDashboardData();
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.adminRepository.getAllSkills();
                return skills;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminUseCase = AdminUseCase;
