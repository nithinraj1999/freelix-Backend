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
exports.JobPostUsecase = void 0;
class JobPostUsecase {
    constructor(jobPostRepository, freelancerrepository, skillRepository) {
        this.jobPostRepository = jobPostRepository;
        this.freelancerrepository = freelancerrepository;
        this.skillRepository = skillRepository;
    }
    createJobPost(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.jobPostRepository.createJobPost(data, file);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllJobPosts(userID, searchQuery, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const MyjobPosts = yield this.jobPostRepository.getAllJobPosts(userID, searchQuery, page);
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
                const deletedJobPost = yield this.jobPostRepository.deleteJobPost(jobId);
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
                const editedPost = yield this.jobPostRepository.editPost(data);
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
                const jobDetails = yield this.jobPostRepository.jobDetails(jobId);
                return jobDetails;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.freelancerrepository.getAllFreelancers();
                return response;
            }
            catch (error) {
                console.error("Error in use case:", error);
                throw error;
            }
        });
    }
    getSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield this.skillRepository.getSkills();
                return skills;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.JobPostUsecase = JobPostUsecase;
