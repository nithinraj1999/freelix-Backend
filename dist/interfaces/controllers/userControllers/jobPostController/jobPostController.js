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
exports.JobPostController = void 0;
class JobPostController {
    constructor(JobPostUsecase, userSocketMap, NotificationService) {
        this.JobPostUsecase = JobPostUsecase;
        this.userSocketMap = userSocketMap;
        this.notificationService = NotificationService;
    }
    createJobPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file ? req.file.path : null;
                const jobPost = yield this.JobPostUsecase.createJobPost(req.body, file);
                const freelancers = yield this.JobPostUsecase.getAllFreelancers();
                const freelancersWithSocketIds = freelancers
                    .filter((freelancer) => this.userSocketMap.has(freelancer._id.toString()))
                    .map((freelancer) => (Object.assign(Object.assign({}, freelancer), { socketId: this.userSocketMap.get(freelancer._id.toString()) })));
                this.notificationService.sendJobPostNotification(freelancersWithSocketIds, jobPost);
                res.status(200).json({ success: true, data: jobPost });
            }
            catch (error) {
                console.error('Error in controller:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to create job post',
                });
            }
        });
    }
    getAllJobPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, searchQuery, page } = req.body;
                const jobPosts = yield this.JobPostUsecase.getAllJobPosts(userID, searchQuery, page);
                res.status(200).json({ success: true, jobPosts });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch job posts',
                });
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.body;
                const deletedJobPost = yield this.JobPostUsecase.deleteJobPost(jobId);
                res.status(200).json({
                    success: true,
                    deletedJobPost: deletedJobPost,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
    editPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedPost = yield this.JobPostUsecase.editPost(req.body);
                res.status(200).json({ success: true, editedPost: editedPost });
            }
            catch (error) {
                console.error(error);
                res.json({ success: false });
            }
        });
    }
    jobPostdetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobID } = req.body;
                const jobDetails = yield this.JobPostUsecase.jobDetails(jobID);
                res.json({ success: true, jobDetails: jobDetails });
            }
            catch (error) {
                console.error(error);
                res.json({ success: false });
            }
        });
    }
    getSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.JobPostUsecase.getSkills();
                res.status(200).json({ success: true, skills: skills });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false });
            }
        });
    }
}
exports.JobPostController = JobPostController;
