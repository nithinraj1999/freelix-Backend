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
exports.FreelancerBidRepository = void 0;
class FreelancerBidRepository {
    constructor(bidModel) {
        this.bidModel = bidModel;
    }
    isExistingBidder(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExistingBidder = yield this.bidModel.findOne({
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
                const bid = new this.bidModel({
                    jobId: jobId,
                    freelancerId: freelancerId,
                    bidAmount: bidAmount,
                    deliveryDays: deliveryDays,
                    proposal: proposal,
                });
                yield bid.save();
                const populatedBid = yield this.bidModel
                    .findById(bid._id)
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
                const allBids = yield this.bidModel
                    .find({
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
                const editBid = yield this.bidModel
                    .findOneAndUpdate({ _id: _id }, { $set: dataToUpdate }, { new: true })
                    .populate('freelancerId');
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
                const allMyBids = yield this.bidModel
                    .find({ freelancerId: userId }, { createdAt: 1, bidAmount: 1, _id: 1, status: 1 })
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
                const myBidDetails = yield this.bidModel
                    .findOne({
                    _id: bidID,
                })
                    .populate('jobId');
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
                const withdraw = yield this.bidModel
                    .findOneAndUpdate({ _id: bidId }, { $set: { status: 'Withdrawn' } }, { new: true })
                    .populate('jobId');
                return withdraw;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FreelancerBidRepository = FreelancerBidRepository;
