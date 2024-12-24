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
exports.UserRepository = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const jobPostModel_1 = __importDefault(require("../models/jobPostModel"));
const bidModel_1 = __importDefault(require("../models/bidModel"));
const notification_1 = __importDefault(require("../models/notification"));
const skillsModel_1 = __importDefault(require("../models/skillsModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const escrow_1 = __importDefault(require("../models/escrow"));
const wallet_1 = __importDefault(require("../models/wallet"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const message_1 = __importDefault(require("../models/message"));
class UserRepository {
    checkEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({
                    email: email,
                    isAdmin: false,
                    isBlock: false,
                });
                if (!user)
                    return null;
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({
                    email: email,
                    isAdmin: false,
                    isBlock: false,
                    isVerified: true,
                });
                if (!user)
                    return null;
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = userModel_1.default.create({
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                isVerified: true,
            });
            return newUser;
        });
    }
    saveUserOtp(otp, email, userDta) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpExpirationTime = 120000;
            const newOtp = new otpModel_1.default({
                otp: otp,
                email: email,
                userData: {
                    name: userDta.name,
                    email: userDta.email,
                    password: userDta.password,
                    phone: userDta.phone,
                },
                createdAt: Date.now(),
            });
            const otpDoc = yield newOtp.save();
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield otpModel_1.default.updateOne({ email: email }, { $set: { otp: null } });
            }), otpExpirationTime);
            return otpDoc;
        });
    }
    updateUserOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOtp = yield otpModel_1.default.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
            return newOtp;
        });
    }
    findOTP(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchOTP = yield otpModel_1.default.findOne({ email: email, otp: otp });
            return matchOTP;
        });
    }
    findById(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ _id: userID });
                if (!user)
                    return null;
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createJobPost(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, title, category, skills, subCategory, description, experience, fixedPrice, paymentType, hourlyPrice, } = data;
                console.log(skills);
                const skillsArray = Array.isArray(skills)
                    ? skills
                    : typeof skills === 'string'
                        ? JSON.parse(skills) // Use JSON.parse to convert the string into an array
                        : []; // Default to an empty array if skills is undefined or not a string
                const response = yield jobPostModel_1.default.create({
                    userID: userID,
                    title: title,
                    category: category,
                    subCategory: subCategory,
                    skills: skillsArray,
                    file: file, // File will either be a string or null
                    description: description,
                    experience: experience,
                    paymentType: paymentType,
                    fixedPrice: fixedPrice,
                    hourlyPrice: {
                        from: hourlyPrice === null || hourlyPrice === void 0 ? void 0 : hourlyPrice.from,
                        to: hourlyPrice === null || hourlyPrice === void 0 ? void 0 : hourlyPrice.to,
                    },
                });
                return response;
            }
            catch (error) {
                console.error('Error creating job post:', error);
                // Rethrow the error so that it can be handled by the use case or controller
                throw new Error('Failed to create job post');
            }
        });
    }
    getAllFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield userModel_1.default
                    .find({ hasFreelancerAccount: true }, { _id: 1 })
                    .lean();
                return freelancer;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllJobPosts(userID, searchQuery, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchFilter = searchQuery
                    ? {
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } }, // Case insensitive search for job title
                        ],
                    }
                    : {};
                const skip = parseInt(page) * 3 - 3;
                const MyPost = yield jobPostModel_1.default
                    .find(Object.assign({ userID: userID, isDelete: false }, searchFilter))
                    .skip(skip)
                    .limit(3);
                const totalDocs = yield jobPostModel_1.default.countDocuments(Object.assign({ userID: userID, isDelete: false }, searchFilter));
                console.log(MyPost);
                return { MyPost, totalDocs };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    deleteJobPost(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jobPostModel_1.default.findByIdAndUpdate({ _id: jobId }, { $set: { isDelete: true } }); // Delete job by ID
                return result;
            }
            catch (error) {
                console.error(`Error deleting job with ID ${jobId}:`, error);
            }
        });
    }
    editPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, title, description, skills, paymentType, hourlyPrice, fixedPrice, } = data;
                const updateData = {
                    title,
                    description,
                    skills,
                    paymentType,
                };
                if (paymentType === 'hourly') {
                    updateData.hourlyPrice = {
                        from: hourlyPrice.from,
                        to: hourlyPrice.to,
                    };
                    updateData.fixedPrice = null;
                }
                else if (paymentType === 'fixed') {
                    updateData.fixedPrice = fixedPrice;
                    updateData.hourlyPrice = null;
                }
                const result = yield jobPostModel_1.default.findByIdAndUpdate(_id, updateData, {
                    new: true,
                });
                if (result) {
                    return result;
                }
                else {
                    console.log('Job post not found.');
                    return null;
                }
            }
            catch (error) {
                console.error(`Error updating job post with ID ${data._id}:`, error);
                throw error;
            }
        });
    }
    jobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobDetails = yield jobPostModel_1.default.findOne({ _id: jobId });
                return jobDetails;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    allBids(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allBids = yield bidModel_1.default.find({
                    jobId: jobId,
                    status: { $ne: 'Withdrawn' },
                })
                    .populate('freelancerId')
                    .sort({ createdAt: -1 });
                return allBids;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getFreelancerDetails(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield userModel_1.default.findOne({ _id: freelancerId });
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
                const notifications = yield notification_1.default.find({
                    userID: userID,
                });
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
                const skills = yield skillsModel_1.default.find({}, { skill: 1, _id: 0 });
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
                const order = yield orderModel_1.default.create({
                    projectId: jobId,
                    clientId: userId,
                    freelancerId: freelancerId,
                    bidId: bidId,
                    paymentStatus: 'completed',
                    total: bidAmount,
                });
                // ========= store funds in escrow
                const escrow = yield escrow_1.default.create({
                    clientId: userId,
                    freelancerId: freelancerId,
                    projectId: jobId,
                    amount: bidAmount,
                });
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllHirings(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hirings = yield orderModel_1.default.find({ clientId: clientId })
                    .populate('projectId', 'title')
                    .populate('freelancerId', 'name');
                return hirings;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async  releasePayment(projectId: string, clientId: string, freelancerId: string, total: string) {
    //   try {
    //     const totalAmount = parseFloat(total);
    //     const freelancerAmount = totalAmount * 0.7;
    //     const platformCharge = totalAmount * 0.3;
    //     const escrowUpdate = await EscrowModel.updateOne(
    //       { clientId, freelancerId, projectId },
    //       { $set: { amount: platformCharge } }
    //     );
    //     if (escrowUpdate.modifiedCount === 0) {
    //       throw new Error('Escrow update failed. Payment not released.');
    //     }
    //     // Check if freelancer's wallet exists
    //     let freelancerWallet = await WalletModel.findOne({ userId: freelancerId });
    //     if (!freelancerWallet) {
    //       // If wallet doesn't exist, create it
    //       freelancerWallet = new WalletModel({
    //         userId: freelancerId,
    //         balance: freelancerAmount,
    //       });
    //       const saveResult = await freelancerWallet.save();
    //       if (!saveResult) {
    //         throw new Error('Failed to create freelancer wallet.');
    //       }
    //     } else {
    //       // If wallet exists, update the balance
    //       freelancerWallet.balance += freelancerAmount;
    //       const updateResult = await freelancerWallet.save(); // Save the updated balance
    //       if (!updateResult) {
    //         throw new Error('Failed to update freelancer wallet.');
    //       }
    //     }
    //     const order = await OrderModel.updateOne({projectId:projectId},{$set:{isPaymentReleased:true}})
    //     return {
    //       success: true,
    //       freelancerAmount,
    //     };
    //   } catch (error) {
    //     console.error('Error releasing payment:', error);
    //     throw error;
    //   }
    // }
    releasePayment(projectId, clientId, freelancerId, total) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalAmount = parseFloat(total);
                const freelancerAmount = totalAmount * 0.7;
                const platformCharge = totalAmount * 0.3;
                const escrowUpdate = yield escrow_1.default.findOneAndUpdate({ clientId, freelancerId, projectId }, { $set: { amount: platformCharge } }, { new: true } // Return the updated document
                ).populate('projectId'); // Populate the projectId field
                let freelancerWallet = yield wallet_1.default.findOne({
                    userId: freelancerId,
                });
                if (!freelancerWallet) {
                    freelancerWallet = new wallet_1.default({
                        userId: freelancerId,
                        balance: freelancerAmount,
                        walletHistory: [
                            {
                                date: new Date(),
                                amount: freelancerAmount,
                                type: 'Credit',
                                description: `Payment received for project - ${escrowUpdate === null || escrowUpdate === void 0 ? void 0 : escrowUpdate.projectId.title}`,
                            },
                        ],
                    });
                    const saveResult = yield freelancerWallet.save();
                    if (!saveResult) {
                        throw new Error('Failed to create freelancer wallet.');
                    }
                }
                else {
                    // If wallet exists, update the balance and add transaction history
                    freelancerWallet.balance += freelancerAmount;
                    freelancerWallet.walletHistory.push({
                        date: new Date(),
                        amount: freelancerAmount,
                        type: 'Credit',
                        description: `Payment received for project - ${escrowUpdate === null || escrowUpdate === void 0 ? void 0 : escrowUpdate.projectId.title}`,
                    });
                    const updateResult = yield freelancerWallet.save(); // Save the updated balance and history
                    if (!updateResult) {
                        throw new Error('Failed to update freelancer wallet.');
                    }
                }
                const order = yield orderModel_1.default.updateOne({ projectId: projectId }, { $set: { isPaymentReleased: true } });
                return {
                    success: true,
                    freelancerAmount,
                };
            }
            catch (error) {
                console.error('Error releasing payment:', error);
                throw error;
            }
        });
    }
    submitReview(clientId, freelancerId, review, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewDoc = yield reviewModel_1.default.create({
                    clientId: clientId,
                    freelancerId: freelancerId,
                    rating: rating,
                    comment: review,
                });
                return reviewDoc;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async fetchAllContacts(userId:string){
    //   try{
    //     const messages = await MessageModel.find({
    //       $or: [{ senderId: userId }, { recipientId: userId }],
    //     }).populate("senderId","name")
    //     .lean();
    //     // Extract unique contact IDs
    //     const contactIds = new Set<string>();
    //     messages.forEach((message) => {
    //       if (message.senderId !== userId) contactIds.add(message.senderId);
    //       if (message.recipientId !== userId) contactIds.add(message.recipientId);
    //     });
    //     // Prepare contacts list
    //     const contacts = Array.from(contactIds).map((id) => ({
    //       id,
    //       name: `User ${id}`,
    //     }));
    //     return contacts
    //   }catch(error){
    //     throw error
    //   }
    // }
    fetchAllContacts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield message_1.default.find({
                    $or: [{ senderId: userId }, { recipientId: userId }],
                })
                    .populate('senderId', 'name')
                    .populate('recipientId', 'name')
                    .lean();
                // Extract unique contacts
                const contactMap = new Map();
                messages.forEach((message) => {
                    // Normalize senderId and recipientId
                    const sender = typeof message.senderId === 'string'
                        ? { _id: message.senderId, name: null }
                        : message.senderId;
                    const recipient = typeof message.recipientId === 'string'
                        ? { _id: message.recipientId, name: null }
                        : message.recipientId;
                    // Add sender to the map
                    if (sender._id !== userId) {
                        contactMap.set(sender._id.toString(), {
                            id: sender._id.toString(),
                            name: sender.name,
                        });
                    }
                    // Add recipient to the map
                    if (recipient._id !== userId) {
                        contactMap.set(recipient._id.toString(), {
                            id: recipient._id.toString(),
                            name: recipient.name,
                        });
                    }
                });
                // Convert Map to Array
                const contacts = Array.from(contactMap.values());
                console.log(contacts);
                return contacts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchChat(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield message_1.default.find({
                    $or: [
                        { senderId: userId, recipientId: contactId },
                        { senderId: contactId, recipientId: userId },
                    ],
                }).sort({ createdAt: 1 });
                return chat;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updatePassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield userModel_1.default.updateOne({ _id: userId }, { $set: { password: password } });
                return updated;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findOne({ _id: userId }, { name: 1, email: 1, phone: 1, profilePicture: 1 });
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
                const data = {};
                if (profilePicture) {
                    data.profilePicture = profilePicture;
                }
                if (name) {
                    data.name = name;
                }
                if (email) {
                    data.email = email;
                }
                const userData = yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true });
                return userData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDeliverable(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield orderModel_1.default.findOne({ _id: orderId }, { "delivery.fileUrl": 1, _id: 0 });
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
