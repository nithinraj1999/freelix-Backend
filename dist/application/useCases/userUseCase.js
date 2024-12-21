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
exports.UserUseCase = void 0;
const s3bucket_1 = require("../services/s3bucket");
class UserUseCase {
    constructor(userRepository, bcrypt, emailService, otpService, jwtToken) {
        this.userRepository = userRepository;
        this.bcrypt = bcrypt;
        this.emailService = emailService;
        this.otpService = otpService;
        this.jwtToken = jwtToken;
    }
    registerUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.findByEmail(data.email);
                if (existingUser) {
                    throw new Error("User with this email already exists.");
                }
                else {
                    if (data.password) {
                        data.password = yield this.bcrypt.hash(data.password);
                    }
                    const otp = yield this.otpService.generateOtp();
                    yield this.userRepository.saveUserOtp(otp, data.email, data); // Store user data temporarily in OTP collection
                    yield this.emailService.sendEmail(data.email, otp);
                    return;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    verification(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findOTP = yield this.userRepository.findOTP(otp, email);
                if (findOTP) {
                    const savedData = yield this.userRepository.save(findOTP.userData);
                    const token = this.jwtToken.generateAccessToken({ email: email });
                    return { findOTP, token };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    authenticateUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
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
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield this.otpService.generateOtp();
                const response = yield this.userRepository.updateUserOtp(otp, email);
                yield this.emailService.sendEmail(response.email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
    createJobPost(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.createJobPost(data, file);
                return response;
            }
            catch (error) {
                console.error("Error in use case:", error);
                // Rethrow the error to be handled by the controller
                throw error;
            }
        });
    }
    getAllFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getAllFreelancers();
                return response;
            }
            catch (error) {
                console.error("Error in use case:", error);
                // Rethrow the error to be handled by the controller
                throw error;
            }
        });
    }
    getAllJobPosts(userID, searchQuery, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const MyjobPosts = yield this.userRepository.getAllJobPosts(userID, searchQuery, page);
                return MyjobPosts;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    deleteJobPost(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedJobPost = yield this.userRepository.deleteJobPost(jobId);
                return deletedJobPost;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedPost = yield this.userRepository.editPost(data);
                return editedPost;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    jobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobDetails = yield this.userRepository.jobDetails(jobId);
                return jobDetails;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    fetchAllBids(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bids = yield this.userRepository.allBids(jobId);
                return bids;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    fetchFreelancerDetails(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield this.userRepository.getFreelancerDetails(freelancerId);
                return details;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchAllNotifications(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield this.userRepository.fetchAllNotifications(userID);
                return notifications;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.userRepository.getSkills();
                return skills;
            }
            catch (error) {
                throw error;
            }
        });
    }
    storeOrder(bidAmount, userId, bidId, freelancerId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.userRepository.storeOrder(bidAmount, userId, bidId, freelancerId, jobId);
                return order;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllHirings(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allHiring = yield this.userRepository.getAllHirings(clientId);
                return allHiring;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    releasePayment(projectId, clientId, freelancerId, total) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const releadPayment = yield this.userRepository.releasePayment(projectId, clientId, freelancerId, total);
                return releadPayment;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    submitReview(clientId, freelancerId, review, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const releadPayment = yield this.userRepository.submitReview(clientId, freelancerId, review, rating);
                return releadPayment;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    fetchAllContacts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield this.userRepository.fetchAllContacts(userId);
                return contacts;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    fetchChat(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield this.userRepository.fetchChat(userId, contactId);
                return chat;
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (!user) {
                    throw new Error("User not found");
                }
                const resetLink = ` http://localhost:5173/reset-password?userId=${user._id}`;
                yield this.emailService.sendEmailToResetPassword(email, resetLink);
                return { success: true, message: "Password reset link sent" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    validateAndStorePassword(userId, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (password !== confirmPassword) {
                    return { success: false, message: "password is not matching" };
                }
                const hashedPassword = yield this.bcrypt.hash(password);
                const updatedPassword = yield this.userRepository.updatePassword(userId, hashedPassword);
                return { success: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.userRepository.getUserData(userId);
                return userData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editData(profilePicture, name, email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let image = null;
                if (profilePicture) {
                    const { originalname, buffer, mimetype } = profilePicture;
                    console.log(originalname);
                    const awsS3instance = new s3bucket_1.S3Bucket();
                    image = yield awsS3instance.uploadProfilePic(originalname, buffer, mimetype, 'profile-pics');
                }
                const editedData = yield this.userRepository.editData(image, name, email, userId);
                return editedData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDeliverable(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliverable = yield this.userRepository.getDeliverable(orderId);
                return deliverable;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserUseCase = UserUseCase;
