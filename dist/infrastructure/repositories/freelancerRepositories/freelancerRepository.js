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
exports.FreelancerRepository = void 0;
class FreelancerRepository {
    constructor(freelancerModel) {
        this.freelancerModel = freelancerModel;
    }
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
                const response = yield this.freelancerModel.updateOne({ _id: userID }, {
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
    getAllFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield this.freelancerModel
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
    findFreelancerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield this.freelancerModel.findOne({ _id: id });
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
                const freelancer = yield this.freelancerModel.updateOne({ _id: userID }, { $set: { role: 'client' } });
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
                const freelancer = yield this.freelancerModel.updateOne({ _id: userID }, { $set: { role: 'freelancer' } });
                return freelancer;
            }
            catch (error) {
                console.error();
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
                    const updatedPortfolio = yield this.freelancerModel.findOneAndUpdate({ _id: userID }, { $push: { portfolio: portfolioItem } }, { new: true, projection: { password: 0 } });
                    return updatedPortfolio;
                }
                const updatedUser = yield this.freelancerModel.findOneAndUpdate({ _id: userID }, { $set: updateObject }, { new: true, projection: { password: 0 } });
                return updatedUser;
            }
            catch (error) {
                console.error('Error updating profile:', error);
                throw error;
            }
        });
    }
    getFreelancerDetails(freelancerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield this.freelancerModel.findOne({
                    _id: freelancerId,
                });
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
                const deletePortfolio = yield this.freelancerModel.updateOne({ _id: userId }, { $pull: { portfolio: { _id: imageId } } });
                return deletePortfolio;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FreelancerRepository = FreelancerRepository;
