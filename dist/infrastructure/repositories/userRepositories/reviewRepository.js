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
exports.ReviewRepository = void 0;
class ReviewRepository {
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    submitReview(clientId, freelancerId, review, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewDoc = yield this.reviewModel.create({
                    clientId: clientId,
                    freelancerId: freelancerId,
                    rating: rating,
                    comment: review,
                });
                return reviewDoc;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ReviewRepository = ReviewRepository;
