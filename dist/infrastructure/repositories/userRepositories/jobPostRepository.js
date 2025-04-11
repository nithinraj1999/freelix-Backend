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
exports.JobPostRepository = void 0;
class JobPostRepository {
    constructor(jobPostModel) {
        this.jobPostModel = jobPostModel;
    }
    createJobPost(data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, title, category, skills, subCategory, description, experience, fixedPrice, paymentType, hourlyPrice, } = data;
                console.log(skills);
                const skillsArray = Array.isArray(skills)
                    ? skills
                    : typeof skills === 'string'
                        ? JSON.parse(skills)
                        : [];
                const response = yield this.jobPostModel.create({
                    userID: userID,
                    title: title,
                    category: category,
                    subCategory: subCategory,
                    skills: skillsArray,
                    file: file,
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
                throw new Error('Failed to create job post');
            }
        });
    }
    getAllJobPosts(userID, searchQuery, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchFilter = searchQuery
                    ? {
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                        ],
                    }
                    : {};
                const skip = parseInt(page) * 3 - 3;
                const MyPost = yield this.jobPostModel
                    .find(Object.assign({ userID: userID, isDelete: false }, searchFilter))
                    .skip(skip)
                    .limit(3);
                const totalDocs = yield this.jobPostModel.countDocuments(Object.assign({ userID: userID, isDelete: false }, searchFilter));
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
                const result = yield this.jobPostModel.findByIdAndUpdate({ _id: jobId }, { $set: { isDelete: true } });
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
                const result = yield this.jobPostModel.findByIdAndUpdate(_id, updateData, {
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
                const jobDetails = yield this.jobPostModel.findOne({ _id: jobId });
                return jobDetails;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.JobPostRepository = JobPostRepository;
