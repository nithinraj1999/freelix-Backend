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
exports.FreelancerController = void 0;
class FreelancerController {
    constructor(freelancerUseCase, jwt) {
        this.freelancerUseCase = freelancerUseCase;
        this.jwt = jwt;
    }
    createFreelancerAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                // if (req.file) {
                //     const awsS3instance = new S3Bucket()
                //     const image = await awsS3instance.uploadProfilePic(
                //         req.file.originalname,
                //         req.file.path,
                //         req.file.mimetype,
                //         'profile-pics'
                //     )
                //     // console.log(image)
                // }
                const createFreelancer = yield this.freelancerUseCase.createFreelancer(req.body, file);
                if (createFreelancer) {
                    const freelancerData = yield this.freelancerUseCase.findFreelancerById(req.body.userID);
                    res.json({ success: true, freelancerData });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    switchToBuying(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const switchToBuying = yield this.freelancerUseCase.switchToBuying(req.body.userID);
                if (switchToBuying) {
                    const accessToken = yield this.jwt.generateAccessToken({
                        _id: req.body.userID,
                        role: 'client',
                    });
                    const refreshToken = yield this.jwt.generateRefreshToken({
                        _id: req.body.userID,
                        role: 'client',
                    });
                    res.cookie('userRefreshJWT', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    });
                    const freelancerData = yield this.freelancerUseCase.findFreelancerById(req.body.userID);
                    res.json({
                        success: true,
                        freelancerData,
                        accessToken: accessToken,
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    switchToSelling(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const switchToBuying = yield this.freelancerUseCase.switchToSelling(req.body.userID);
                if (switchToBuying) {
                    const accessToken = yield this.jwt.generateAccessToken({
                        _id: req.body.userID,
                        role: 'freelancer',
                    });
                    const refreshToken = yield this.jwt.generateRefreshToken({
                        _id: req.body.userID,
                        role: 'freelancer',
                    });
                    res.cookie('userRefreshJWT', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    });
                    const freelancerData = yield this.freelancerUseCase.findFreelancerById(req.body.userID);
                    res.json({
                        success: true,
                        freelancerData,
                        accessToken: accessToken,
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getJobList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerSkills } = req.body;
                console.log(freelancerSkills);
                const projectType = req.query.projectType;
                const minPrice = req.query.minPrice;
                const maxPrice = req.query.maxPrice;
                const skills = req.query.skills || '';
                const deliveryDays = req.query.deliveryDays;
                const sort = req.query.sort;
                const search = req.query.search;
                const page = req.query.page;
                const experience = req.query.experience;
                const jobListAndCount = yield this.freelancerUseCase.getJobList(projectType, minPrice, maxPrice, skills, deliveryDays, sort, search, page, experience, freelancerSkills);
                const jobListCount = yield this.freelancerUseCase.getJobListCount();
                const { jobList, count } = jobListAndCount;
                res.status(200).json({
                    success: true,
                    jobList: jobList,
                    jobListCount: count,
                });
            }
            catch (error) {
                console.error();
            }
        });
    }
    editprofile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("port....", req.file);
            try {
                const file = req.file;
                let firstFile = null;
                // if (files) {
                //     if (Array.isArray(files)) {
                //         firstFile = files[0] ?? null 
                //     } else {
                //         const fileArray = Object.values(files).flat() 
                //         firstFile = fileArray[0] ?? null 
                //     }
                // }
                console.log("portfolio...", firstFile);
                const updatedProfile = yield this.freelancerUseCase.editProfile(req.body, file);
                return res.status(200).json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: updatedProfile,
                });
            }
            catch (error) {
                console.error('Error updating profile:', error);
                return res.status(500).json({
                    success: false,
                    message: 'An error occurred while updating the profile',
                });
            }
        });
    }
    getJobDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobID } = req.body;
                const jobDetails = yield this.freelancerUseCase.getJobDetails(jobID);
                return res.status(200).json({
                    success: true,
                    message: 'job details fetched successfully',
                    jobDetails: jobDetails,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'An error occurred while fetching job details',
                });
            }
        });
    }
    isExistingBidder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId, userId } = req.body;
                const isExistingBidder = yield this.freelancerUseCase.isBidderAlreadyExist(jobId, userId);
                if (isExistingBidder) {
                    res.json({ isExist: true });
                }
                else {
                    res.json({ isExist: false });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                });
            }
        });
    }
    submitBid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId, freelancerId, bidAmount, deliveryDays, proposal } = req.body;
                const isAlreadybid = yield yield this.freelancerUseCase.isBidderAlreadyExist(jobId, freelancerId);
                if (isAlreadybid) {
                    res.json({ success: false, message: 'already bidded' });
                }
                else {
                    const bid = yield this.freelancerUseCase.submitBid(jobId, freelancerId, bidAmount, deliveryDays, proposal);
                    res.status(200).json({ success: true, bid: bid });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'An error occurred while submiting bid',
                });
            }
        });
    }
    getAllBids(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.body;
                const allBids = yield this.freelancerUseCase.getAllBids(jobId);
                res.status(200).json({ success: true, allBids: allBids });
            }
            catch (error) {
                res.json({ success: false });
                console.error();
            }
        });
    }
    editMyBid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                // console.log("mmm",req.body);
                const bidEdit = yield this.freelancerUseCase.editBid(data);
                res.status(200).json({ success: true, editedBid: bidEdit });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    myBids(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const myBids = yield this.freelancerUseCase.myBids(userId);
                res.status(200).json({ success: true, myBids: myBids });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    myBidDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bidID } = req.body;
                const myBidDetails = yield this.freelancerUseCase.myBidDetails(bidID);
                res.status(200).json({ success: true, myBidDetails: myBidDetails });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    withdrawBid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bidId } = req.body;
                console.log(bidId);
                const withdraw = yield this.freelancerUseCase.withdrawBid(bidId);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    fetchFreelancerDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { freelancerId } = req.body;
                const details = yield this.freelancerUseCase.fetchFreelancerDetails(freelancerId);
                res.status(200).json({ success: true, freelancerDetails: details });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    deletePortfolioImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageId, userId, image } = req.body;
                const details = yield this.freelancerUseCase.deletePortFolioImg(imageId, userId, image);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    getMyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.body;
                console.log(freelancerId);
                const myOrders = yield this.freelancerUseCase.getMyOrders(freelancerId);
                res.json({ success: true, orders: myOrders });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while fetching orders.',
                });
            }
        });
    }
    completeOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const { orderId, description } = req.body;
                const completeOrder = yield this.freelancerUseCase.completeOrder(orderId, description, file);
                res.json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred .',
                });
            }
        });
    }
    fetchReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.body;
                const allReviews = yield this.freelancerUseCase.fetchReviews(freelancerId);
                res.json({ success: true, allReviews: allReviews });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred .',
                });
            }
        });
    }
    fetchWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.body;
                const wallet = yield this.freelancerUseCase.fetchWallet(freelancerId);
                console.log(wallet);
                res.json({ success: true, wallet: wallet });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    dashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const data = yield this.freelancerUseCase.dashboardData(userId);
                res.json(data);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.freelancerUseCase.getSkills();
                res.json(skills);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.FreelancerController = FreelancerController;
