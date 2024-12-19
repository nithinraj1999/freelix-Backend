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
exports.AdminController = void 0;
class AdminController {
    constructor(adminUseCase, jwt) {
        this.adminUseCase = adminUseCase;
        this.jwt = jwt;
    }
    loginAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield this.adminUseCase.authenticateAdmin(email, password);
                if (!admin) {
                    return res
                        .status(404)
                        .json({ success: false, message: "User not found" });
                }
                else {
                    const accessToken = yield this.jwt.generateAccessToken({
                        _id: admin._id,
                        role: admin.role,
                    });
                    const refreshToken = yield this.jwt.generateRefreshToken({
                        _id: admin._id,
                        role: admin.role,
                    });
                    res.cookie("adminRefreshJWT", refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    });
                    res.status(200).json({
                        success: true,
                        admin: {
                            _id: admin._id,
                            name: admin.name,
                            email: admin.email,
                            phone: admin.phone,
                            role: admin.role,
                            isBlock: admin.isBlock,
                            isVerified: admin.isVerified,
                        },
                        message: "Login successfull",
                        accessToken: accessToken,
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Login failed" });
            }
        });
    }
    getClientData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1; // Default page is 1
                const limit = parseInt(req.query.limit) || 5; // Default limit is 5
                const skip = (page - 1) * limit;
                const totalClients = yield this.adminUseCase.getTotalClients();
                const clients = yield this.adminUseCase.getClientData(skip, limit);
                res.json({
                    sucees: true,
                    clients: clients,
                    totalClients,
                    totalPages: Math.ceil(totalClients / limit),
                    currentPage: page,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientID } = req.body;
                const response = yield this.adminUseCase.blockClient(clientID);
                console.log(response);
                if (response) {
                    console.log("res cond");
                    res.json({ success: true });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    unblockClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientID } = req.body;
                const response = yield this.adminUseCase.unblockClient(clientID);
                if (response) {
                    res.json({ success: true });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const profilePicPath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
                    ? req.file.buffer
                    : null;
                const response = yield this.adminUseCase.createUser(data, profilePicPath);
                res.json({ succes: true });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const profilePicPath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || null;
                // Pass the data and profile picture path to the use case for updating the user
                const response = yield this.adminUseCase.editUser(data, profilePicPath);
                res.json({
                    success: true,
                    message: "User updated successfully",
                    data: response,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Error updating user" });
            }
        });
    }
    getFreelancerData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancers = yield this.adminUseCase.getFreelancerData();
                res.json({ success: true, freelancers: freelancers });
            }
            catch (error) {
                console.error(error); // Optionally log the error for debugging
                res
                    .status(500)
                    .json({ success: false, message: "Failed to retrieve freelancers" });
            }
        });
    }
    // Block a freelancer
    blockFreelancer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerID } = req.body;
                console.log(freelancerID);
                const response = yield this.adminUseCase.blockFreelancer(freelancerID);
                if (response) {
                    console.log("success ");
                    res.json({
                        success: true,
                        message: "Freelancer blocked successfully",
                        freelancer: response,
                    });
                }
                else {
                    res
                        .status(400)
                        .json({ success: false, message: "Error blocking freelancer" });
                }
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ success: false, message: "Error blocking freelancer" });
            }
        });
    }
    // Unblock a freelancer
    unblockFreelancer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerID } = req.body;
                const response = yield this.adminUseCase.unblockFreelancer(freelancerID);
                if (response) {
                    res.json({
                        success: true,
                        message: "Freelancer unblocked successfully",
                    });
                }
                else {
                    res
                        .status(400)
                        .json({ success: false, message: "Error unblocking freelancer" });
                }
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ success: false, message: "Error unblocking freelancer" });
            }
        });
    }
    // Create a freelancer
    createFreelancer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                console.log("bbhbjhbh", req.body);
                const profilePicPath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path)
                    ? req.file.path
                    : null;
                const response = yield this.adminUseCase.createFreelancer(data, profilePicPath);
                res.json({ success: true, message: "Freelancer created successfully" });
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ success: false, message: "Error creating freelancer" });
            }
        });
    }
    // Edit a freelancer
    editFreelancer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const skills = JSON.parse(req.body.skills); // Parse skills array
                const languages = JSON.parse(req.body.languages); // Parse languages array
                const profilePicPath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || null;
                const response = yield this.adminUseCase.editFreelancer(data, profilePicPath);
                res.json({
                    success: true,
                    message: "Freelancer updated successfully",
                    data: response,
                });
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ success: false, message: "Error updating freelancer" });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.adminRefreshJWT;
                if (!refreshToken) {
                    return res
                        .status(401)
                        .json({ success: false, message: "Refresh token not found" });
                }
                // Verify the refresh token
                const userData = this.jwt.verifyRefreshToken(refreshToken); // Pass true to indicate it's a refresh token
                // If valid, generate a new access token
                const newAccessToken = this.jwt.generateAccessToken({
                    _id: userData._id,
                    role: userData.role,
                });
                res.status(200).json({ success: true, accessToken: newAccessToken });
            }
            catch (error) {
                console.error(error);
                res
                    .status(401)
                    .json({ success: false, message: "Invalid or expired refresh token" });
            }
        });
    }
    addSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skill, description } = req.body;
                console.log(req.body);
                const skills = yield this.adminUseCase.addSkills(skill, description);
                console.log(skills);
                if (skills) {
                    res.json({ success: true });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.adminUseCase.getDashboardData();
                res.json({ dashboardData: data });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.adminUseCase.getAllSkills();
                if (skills) {
                    res.json({ success: true, skills });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.AdminController = AdminController;
