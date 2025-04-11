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
exports.FreelancerJobRepository = void 0;
class FreelancerJobRepository {
    constructor(jobPostModel) {
        this.jobPostModel = jobPostModel;
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
                const jobList = yield this.jobPostModel
                    .find(query)
                    .sort(sortOption)
                    .skip(skip)
                    .limit(3);
                const count = yield this.jobPostModel.countDocuments(query);
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
                const count = yield this.jobPostModel.countDocuments({
                    isDelete: false,
                });
                return count;
            }
            catch (error) {
                throw error;
            }
        });
    }
    jobDetails(jobID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobDetails = yield this.jobPostModel.findOne({ _id: jobID });
                return jobDetails;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.FreelancerJobRepository = FreelancerJobRepository;
