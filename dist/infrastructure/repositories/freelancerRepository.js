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
exports.FreelancerRepository = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jobPostModel_1 = __importDefault(require("../models/jobPostModel"));
const bidModel_1 = __importDefault(require("../models/bidModel"));
const notification_1 = __importDefault(require("../models/notification"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const wallet_1 = __importDefault(require("../models/wallet"));
const mongoose_1 = __importDefault(require("mongoose"));
const skillsModel_1 = __importDefault(require("../models/skillsModel"));
class FreelancerRepository {
    createFreelancerAccount(data, profileImagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, skills, languages, education, userID } = data;
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
                const response = yield userModel_1.default.updateOne({ _id: userID }, {
                    $set: {
                        title: name,
                        description: description,
                        languages: languageArray,
                        skills: skillsArray,
                        profilePicture: profileImagePath,
                        role: 'freelancer',
                        hasFreelancerAccount: true,
                    },
                });
                return response;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findFreelancerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield userModel_1.default.findOne({ _id: id });
                return freelancer;
            }
            catch (error) {
                console.error();
            }
        });
    }
    switchToBuying(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield userModel_1.default.updateOne({ _id: userID }, { $set: { role: 'client' } });
                return freelancer;
            }
            catch (error) {
                console.error();
            }
        });
    }
    switchToSelling(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield userModel_1.default.updateOne({ _id: userID }, { $set: { role: 'freelancer' } });
                return freelancer;
            }
            catch (error) {
                console.error();
            }
        });
    }
    jobList(projectType, minPrice, maxPrice, skills, deliveryDays, sort, search, page, experience, freelancerSkills) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    isDelete: false,
                };
                if (projectType) {
                    query.paymentType = projectType;
                }
                if (minPrice || maxPrice) {
                    const min = minPrice ? parseInt(minPrice, 10) : undefined;
                    const max = maxPrice ? parseInt(maxPrice, 10) : undefined;
                    if (projectType === 'fixed') {
                        query.fixedPrice = {};
                        if (min !== undefined)
                            query.fixedPrice.$gte = min;
                        if (max !== undefined)
                            query.fixedPrice.$lte = max;
                    }
                    else if (projectType === 'hourly') {
                        query.$and = [];
                        if (min !== undefined) {
                            query.$and.push({ 'hourlyPrice.from': { $gte: min } });
                        }
                        if (max !== undefined) {
                            query.$and.push({ 'hourlyPrice.to': { $lte: max } });
                        }
                    }
                }
                if (skills && skills.length > 0) {
                    query.skills = { $in: skills };
                }
                if (search) {
                    query.title = { $regex: search, $options: 'i' };
                }
                if (freelancerSkills === null || freelancerSkills === void 0 ? void 0 : freelancerSkills.length) {
                    query.skills = { $in: freelancerSkills };
                }
                let sortOption = {};
                if (sort === 'lowToHigh') {
                    if (projectType === 'fixed') {
                        sortOption = { fixedPrice: 1 };
                    }
                    else if (projectType === 'hourly') {
                        sortOption = { 'hourlyPrice.from': 1 };
                    }
                }
                else if (sort === 'highToLow') {
                    if (projectType === 'fixed') {
                        sortOption = { fixedPrice: -1 };
                    }
                    else if (projectType === 'hourly') {
                        sortOption = { 'hourlyPrice.from': -1 };
                    }
                }
                if (experience && experience != 'any') {
                    query.experience = experience;
                }
                const skip = parseInt(page) * 3 - 3;
                const jobList = yield jobPostModel_1.default
                    .find(query)
                    .sort(sortOption)
                    .skip(skip)
                    .limit(3);
                const count = yield jobPostModel_1.default.countDocuments(query);
                return { jobList, count };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getJobListCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield jobPostModel_1.default.countDocuments({ isDelete: false });
                return count;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editProfile(data, portfolioUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, name, title, description, skills } = data;
                const updateObject = {};
                if (name) {
                    updateObject.name = name;
                }
                if (title) {
                    updateObject.title = title;
                }
                if (description) {
                    updateObject.description = description;
                }
                if (skills) {
                    updateObject.skills = skills;
                }
                if (portfolioUrl) {
                    const portfolioItem = {
                        image: portfolioUrl,
                        title: title || '',
                        description: description || '',
                    };
                    const updatedPortfolio = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $push: { portfolio: portfolioItem } }, { new: true, projection: { password: 0 } });
                    return updatedPortfolio;
                }
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: userID }, { $set: updateObject }, { new: true, projection: { password: 0 } });
                return updatedUser;
            }
            catch (error) {
                console.error('Error updating profile:', error);
                throw error;
            }
        });
    }
    jobDetails(jobID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobDetails = yield jobPostModel_1.default.findOne({ _id: jobID });
                return jobDetails;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    isExistingBidder(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExistingBidder = yield bidModel_1.default.findOne({
                    jobId: jobId,
                    freelancerId: userId,
                    status: { $ne: 'Withdrawn' },
                });
                return isExistingBidder;
            }
            catch (error) {
                throw error;
            }
        });
    }
    submitBid(jobId, freelancerId, bidAmount, deliveryDays, proposal) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bid = new bidModel_1.default({
                    jobId: jobId,
                    freelancerId: freelancerId,
                    bidAmount: bidAmount,
                    deliveryDays: deliveryDays,
                    proposal: proposal,
                });
                yield bid.save();
                const populatedBid = yield bidModel_1.default.findById(bid._id)
                    .populate('jobId')
                    .populate('freelancerId');
                return populatedBid;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllBids(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allBids = yield bidModel_1.default.find({
                    jobId: jobId,
                    status: { $ne: 'withdrawn' },
                })
                    .populate('freelancerId')
                    .sort({ createdAt: -1 });
                return allBids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editBid(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, bidAmount, deliveryDays, proposal } = data;
                const dataToUpdate = {};
                if (bidAmount) {
                    dataToUpdate.bidAmount = bidAmount;
                }
                if (deliveryDays) {
                    dataToUpdate.deliveryDays = deliveryDays;
                }
                if (proposal) {
                    dataToUpdate.proposal = proposal;
                }
                const editBid = yield bidModel_1.default.findOneAndUpdate({ _id: _id }, { $set: dataToUpdate }, { new: true }).populate('freelancerId');
                return editBid;
            }
            catch (error) {
                throw error;
            }
        });
    }
    myBids(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allMyBids = yield bidModel_1.default.find({ freelancerId: userId }, { createdAt: 1, bidAmount: 1, _id: 1, status: 1 })
                    .populate('jobId', 'title')
                    .sort({ createdAt: -1 });
                return allMyBids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    myBidDetails(bidID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myBidDetails = yield bidModel_1.default.findOne({
                    _id: bidID,
                }).populate('jobId');
                return myBidDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    withdrawBid(bidId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const withdraw = yield bidModel_1.default.findOneAndUpdate({ _id: bidId }, { $set: { status: 'Withdrawn' } }, { new: true }).populate('jobId');
                return withdraw;
            }
            catch (error) {
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
    deletePortFolioImg(imageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletePortfolio = yield userModel_1.default.updateOne({ _id: userId }, { $pull: { portfolio: { _id: imageId } } });
                deletePortfolio;
            }
            catch (error) {
                throw error;
            }
        });
    }
    storeNotification(userID, freelancerId, freelancerName, createdAt, bidAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newNotification = notification_1.default.create({
                    userID: userID,
                    freelancerId: freelancerId,
                    freelancerName: freelancerName,
                    bidAmount: bidAmount,
                    createdAt: createdAt,
                });
                return newNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMyOrders(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield orderModel_1.default.find({ freelancerId: freelancerId })
                    .populate({ path: 'projectId', select: 'title description' })
                    .populate({ path: 'bidId', select: 'deliveryDays' })
                    .populate({ path: 'clientId', select: 'profilePicture' });
                return orders;
            }
            catch (error) {
                throw error;
            }
        });
    }
    completeOrder(orderId, description, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadDate = new Date();
                const orders = yield orderModel_1.default.updateOne({ _id: orderId }, {
                    $set: {
                        delivery: {
                            description: description,
                            fileUrl: file,
                            uploadDate: uploadDate,
                        },
                        status: 'Completed',
                    },
                });
                return orders;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchReviews(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield reviewModel_1.default.find({
                    freelancerId: freelancerId,
                }).populate({
                    path: 'clientId',
                    select: 'name profilePicture',
                });
                return reviews;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchWallet(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield wallet_1.default.findOne({ userId: freelancerId });
                return wallet;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    dashboardData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const revenueData = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'Completed',
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$total' },
                            totalEarnings: {
                                $sum: {
                                    $multiply: ['$total', 0.7],
                                },
                            },
                        },
                    },
                ]);
                const pendingData = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'pending',
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalPendingEarnings: {
                                $sum: {
                                    $multiply: ['$total', 0.7],
                                },
                            },
                        },
                    },
                ]);
                const totalOrders = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                        },
                    },
                    {
                        $count: 'totalOrders',
                    },
                ]);
                const totalBids = yield bidModel_1.default.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                        },
                    },
                    {
                        $count: 'totalBids',
                    },
                ]);
                const pendingOrders = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'pending',
                        },
                    },
                    {
                        $count: 'totalPendingOrders',
                    },
                ]);
                const orderByDate = yield orderModel_1.default.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'Completed',
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
                const totalPendingOrders = pendingOrders.length > 0
                    ? pendingOrders[0].totalPendingOrders
                    : 0;
                const totalBidsCount = totalBids.length > 0 ? totalBids[0].totalBids : 0;
                const totalOrdersCount = totalOrders.length > 0 ? totalOrders[0].totalOrders : 0;
                const pendingEarnings = pendingData.length > 0 ? pendingData[0].totalPendingEarnings : 0;
                const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
                const earnings = revenueData.length > 0 ? revenueData[0].totalEarnings : 0;
                // console.log(revenue);
                // console.log(earnings);
                // console.log(pendingEarnings);
                // console.log(totalOrdersCount);
                // console.log(totalBidsCount);
                // console.log(totalPendingOrders);
                // console.log(orderByDate);
                return {
                    revenue,
                    earnings,
                    pendingEarnings,
                    totalOrdersCount,
                    totalBidsCount,
                    totalPendingOrders,
                    orderByDate,
                };
            }
            catch (error) {
                console.error('Error calculating total revenue and earnings:', error);
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
}
exports.FreelancerRepository = FreelancerRepository;
