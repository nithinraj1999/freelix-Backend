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
exports.UserController = void 0;
const socket_1 = require("../../application/services/socket");
const stripe_1 = __importDefault(require("stripe"));
const s3bucket_1 = require("../../application/services/s3bucket");
const stream_1 = require("stream"); // Node.js stream module
class UserController {
    constructor(userUseCase, jwt) {
        this.userUseCase = userUseCase;
        this.jwt = jwt;
    }
    //================================== user registration =======================================
    // async register(req: Request, res: Response) {
    //   try {
    //     const {password,confirmPassword} =req.body
    //     if(password !== confirmPassword){
    //       res.json({message:"password is not matching"})
    //     }else{
    //     const user = await this.userUseCase.registerUser(req.body);
    //     res.status(201).json({
    //       success:true,
    //       userID: user,
    //       email:req.body.email,
    //       message:
    //         "User registration successful. Please verify the OTP sent to your email.",
    //     });
    //   }
    //   } catch (err) {
    //     res.json({ success: false,message:"Email already exist" });    }
    // }
    //otp verification
    verification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { otp, email } = req.body;
                // const verify = await this.userUseCase.verification(otp, email);
                // if (verify) {
                //     res.status(201).json({ success: true, message: "otp verified." });
                // }else{
                //   res.json({ success: false, message: "otp not verified." });
                // }
            }
            catch (error) {
                // res.status(500).json({ success: false, message: "otp not verified." });
                console.log(error);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userUseCase.authenticateUser(email, password);
                if (!user) {
                    return res
                        .status(404)
                        .json({ success: false, message: "User not found" });
                }
                else {
                }
                const accessToken = yield this.jwt.generateAccessToken({
                    _id: user._id,
                    role: user.role,
                });
                const refreshToken = yield this.jwt.generateRefreshToken({
                    _id: user._id,
                    role: user.role,
                });
                res.cookie("userRefreshJWT", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        hasFreelancerAccount: user.hasFreelancerAccount,
                        profilePicture: user.profilePicture,
                        isBlock: user.isBlock,
                        isVerified: user.isVerified,
                        description: user.description,
                        skills: user.skills,
                        languages: user.languages,
                        isFreelancerBlock: user.isFreelancerBlock,
                    },
                    message: "Login successfull",
                    accessToken: accessToken,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Login failed" });
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const resend = yield this.userUseCase.resendOTP(email);
                res.json({ success: true });
            }
            catch (error) {
                res.json({ success: false, error: error });
            }
        });
    }
    createJobPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file ? req.file.path : null;
                const jobPost = yield this.userUseCase.createJobPost(req.body, file);
                const freelancers = yield this.userUseCase.getAllFreelancers(); // Specify the type of freelancers
                const freelancersWithSocketIds = freelancers
                    .filter((freelancer) => socket_1.userSocketMap.has(freelancer._id.toString())) // Keep only freelancers with a valid socket ID
                    .map((freelancer) => (Object.assign(Object.assign({}, freelancer), { socketId: socket_1.userSocketMap.get(freelancer._id.toString()) })));
                // NotificationService.sendJobPostNotification(
                //   freelancersWithSocketIds,
                //   jobPost
                // );
                res.status(200).json({ success: true, data: jobPost });
            }
            catch (error) {
                console.error("Error in controller:", error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to create job post" });
            }
        });
    }
    getAllJobPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, searchQuery, page } = req.body;
                const jobPosts = yield this.userUseCase.getAllJobPosts(userID, searchQuery, page);
                res.status(200).json({ success: true, jobPosts });
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to fetch job posts" });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.body;
                const deletedJobPost = yield this.userUseCase.deleteJobPost(jobId);
                res.status(200).json({ success: true, deletedJobPost: deletedJobPost });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedPost = yield this.userUseCase.editPost(req.body);
                res.status(200).json({ success: true, editedPost: editedPost });
            }
            catch (error) {
                console.error(error);
                res.json({ success: false });
            }
        });
    }
    jobPostdetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobID } = req.body;
                const jobDetails = yield this.userUseCase.jobDetails(jobID);
                res.json({ success: true, jobDetails: jobDetails });
            }
            catch (error) {
                console.error(error);
                res.json({ success: false });
            }
        });
    }
    fetchAllBids(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.body;
                const bids = yield this.userUseCase.fetchAllBids(jobId);
                res.json({ success: true, bids: bids });
            }
            catch (error) {
                console.error(error);
                res.json({ success: false });
            }
        });
    }
    fetchFreelancerDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { freelancerId } = req.body;
                const details = yield this.userUseCase.fetchFreelancerDetails(freelancerId);
                res.status(200).json({ success: true, freelancerDetails: details });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    fetchAllNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID } = req.body;
                const notifications = yield this.userUseCase.fetchAllNotifications(userID);
                res.status(200).json({ success: true, notifications: notifications });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    getSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.userUseCase.getSkills();
                res.status(200).json({ success: true, skills: skills });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    makePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bidAmount, userId, bidId, freelancerId, jobId } = req.body;
                const order = yield this.userUseCase.storeOrder(bidAmount, userId, bidId, freelancerId, jobId);
                const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
                const lineItems = [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Product 1',
                            },
                            unit_amount: bidAmount * 100,
                        },
                        quantity: 1,
                    },
                ];
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: lineItems,
                    mode: "payment",
                    success_url: process.env.STRIPE_SUCCESS_URL,
                    cancel_url: process.env.STRIPE_CANCEL_URL,
                });
                res.json({ id: session.id });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllHiring(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId } = req.body;
                const allHirings = yield this.userUseCase.getAllHirings(clientId);
                if (allHirings) {
                    res.status(200).json({ success: true, allHirings: allHirings });
                }
                else {
                    res.status(404).json({ success: false, message: "No hirings found" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    releasePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, clientId, freelancerId, total } = req.body;
                const allHirings = yield this.userUseCase.releasePayment(projectId, clientId, freelancerId, total);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    submitReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId, freelancerId, review, rating } = req.body;
                const submission = yield this.userUseCase.submitReview(clientId, freelancerId, review, rating);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    fetchAllContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const allContacts = yield this.userUseCase.fetchAllContacts(userId);
                res.status(200).json({ success: true, allContacts: allContacts });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    fetchChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, contactId } = req.query;
                const chat = yield this.userUseCase.fetchChat(userId, contactId);
                res.status(200).json({ success: true, chat: chat });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const sendEmail = yield this.userUseCase.resetPassword(email);
                res.json(sendEmail);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params, password, confirmPassword } = req.body;
                const userId = params;
                const updatedPassword = yield this.userUseCase.validateAndStorePassword(userId, password, confirmPassword);
                res.json(updatedPassword);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const userDetails = yield this.userUseCase.getUserData(userId);
                res.json({ success: true, userDetails: userDetails });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, userId } = req.body;
                const userDetails = yield this.userUseCase.editData(req.file, name, email, userId);
                if (!userDetails) {
                    return res.status(404).json({ success: false, message: "User not found." });
                }
                res.json({ success: true, message: "User details updated successfully.", data: userDetails });
            }
            catch (error) {
                console.error("Error in editData:", error);
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        });
    }
    downloadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                const deliverable = yield this.userUseCase.getDeliverable(orderId);
                const file = deliverable.delivery.fileUrl;
                const baseUrl = "https://freelixs3.s3.eu-north-1.amazonaws.com/";
                const fileKey = file.startsWith(baseUrl) ? file.replace(baseUrl, "") : file;
                const awsS3instance = new s3bucket_1.S3Bucket();
                const response = yield awsS3instance.downloads3Object(fileKey);
                if (response.Body && response.Body instanceof stream_1.Readable) {
                    console.log(response.ContentType);
                    res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
                    res.setHeader("Content-Type", response.ContentType || "application/octet-stream");
                    response.Body.pipe(res);
                }
                else {
                    res.status(400).json({ success: false, message: "File not found or unable to retrieve file" });
                }
            }
            catch (error) {
                console.error("Error while downloading", error);
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        });
    }
}
exports.UserController = UserController;
