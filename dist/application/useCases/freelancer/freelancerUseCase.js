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
exports.FreelancerUseCase = void 0;
const notificationService_1 = require("../../services/notificationService");
const socket_1 = require("../../services/socket");
const s3bucket_1 = require("../../services/s3bucket");
class FreelancerUseCase {
    constructor(reelancerRepository, bcrypt, jwtToken) {
        this.freelancerRepository = reelancerRepository;
        this.bcrypt = bcrypt;
        this.jwtToken = jwtToken;
    }
    createFreelancer(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let image = null;
                const { originalname, buffer, mimetype } = file;
                console.log(originalname);
                if (file) {
                    const awsS3instance = new s3bucket_1.S3Bucket();
                    image = yield awsS3instance.uploadProfilePic(originalname, buffer, mimetype, 'profile-pics');
                    console.log(image);
                }
                const response = yield this.freelancerRepository.createFreelancerAccount(data, image);
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
                const freelancer = yield this.freelancerRepository.findFreelancerById(id);
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
                const freelancer = yield this.freelancerRepository.switchToBuying(userID);
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
                const freelancer = yield this.freelancerRepository.switchToSelling(userID);
                return freelancer;
            }
            catch (error) {
                console.error();
            }
        });
    }
    getJobList(projectType, minPrice, maxPrice, skills, deliveryDays, sort, search, page, experience, freelancerSkills) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobList = yield this.freelancerRepository.jobList(projectType, minPrice, maxPrice, skills, deliveryDays, sort, search, page, experience, freelancerSkills);
                return jobList;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getJobListCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobListCount = yield this.freelancerRepository.getJobListCount();
                return jobListCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editProfile(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let image = null;
                if (file) {
                    const { originalname, buffer, mimetype } = file;
                    const awsS3instance = new s3bucket_1.S3Bucket();
                    image = yield awsS3instance.uploadProfilePic(originalname, buffer, mimetype, 'portfolios');
                    console.log(image);
                }
                const jobList = yield this.freelancerRepository.editProfile(data, image);
                return jobList;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getJobDetails(jobID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobDetails = yield this.freelancerRepository.jobDetails(jobID);
                return jobDetails;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    isBidderAlreadyExist(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExistingBidder = yield this.freelancerRepository.isExistingBidder(jobId, userId);
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
                const bid = yield this.freelancerRepository.submitBid(jobId, freelancerId, bidAmount, deliveryDays, proposal);
                const storednotification = yield this.freelancerRepository.storeNotification(bid.jobId.userID, bid.freelancerId, bid.freelancerId.name, bid.createdAt, bid.bidAmount);
                if (bid) {
                    const clientSocketID = socket_1.userSocketMap.get(bid.jobId.userID.toString());
                    if (clientSocketID) {
                        yield notificationService_1.NotificationService.sendNewBidDetails(clientSocketID, bid);
                        yield notificationService_1.NotificationService.sendNotification(clientSocketID, bid);
                    }
                    else {
                        console.warn(`No client socket ID found for user ${bid.jobId.userID}`);
                    }
                }
                return bid;
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
                const allBids = yield this.freelancerRepository.getAllBids(jobId);
                return allBids;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editBid(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const edit = yield this.freelancerRepository.editBid(data);
                return edit;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    myBids(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myBids = yield this.freelancerRepository.myBids(userId);
                return myBids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    myBidDetails(bidID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myBidDetails = yield this.freelancerRepository.myBidDetails(bidID);
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
                const withdraw = yield this.freelancerRepository.withdrawBid(bidId);
                if (withdraw) {
                    const id = withdraw.jobId.userID;
                    const clientSocketID = socket_1.userSocketMap.get(id.toString());
                    if (clientSocketID) {
                        yield notificationService_1.NotificationService.removeBid(clientSocketID, bidId);
                    }
                }
                return withdraw;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchFreelancerDetails(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield this.freelancerRepository.getFreelancerDetails(freelancerId);
                return details;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deletePortFolioImg(imageId, userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (image) {
                    const awsS3instance = new s3bucket_1.S3Bucket();
                    yield awsS3instance.deleteS3object(image);
                }
                const portfolioDelition = yield this.freelancerRepository.deletePortFolioImg(imageId, userId);
                return portfolioDelition;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMyOrders(freelancrId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.freelancerRepository.getMyOrders(freelancrId);
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
                // let project: string | null = null
                let image = null;
                if (file) {
                    const { originalname, buffer, mimetype } = file;
                    console.log(originalname);
                    const awsS3instance = new s3bucket_1.S3Bucket();
                    image = yield awsS3instance.uploadProfilePic(originalname, buffer, mimetype, 'project-files');
                    console.log(image);
                }
                // if (file) {
                //     const cloudinaryInstance = new Cloudinary()
                //     const image = await cloudinaryInstance.uploadProfilePic(file)
                //     project = image.url
                // }
                // console.log('url', project)
                const completeOrder = yield this.freelancerRepository.completeOrder(orderId, description, image);
                return completeOrder;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchReviews(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield this.freelancerRepository.fetchReviews(freelancerId);
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
                const wallet = yield this.freelancerRepository.fetchWallet(freelancerId);
                return wallet;
            }
            catch (error) {
                throw error;
            }
        });
    }
    dashboardData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.freelancerRepository.dashboardData(userId);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.freelancerRepository.getSkills();
                return skills;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FreelancerUseCase = FreelancerUseCase;
