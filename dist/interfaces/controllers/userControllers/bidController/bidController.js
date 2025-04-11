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
exports.BidController = void 0;
class BidController {
    constructor(bidUseCase) {
        this.bidUseCase = bidUseCase;
    }
    fetchAllBids(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.body;
                const bids = yield this.bidUseCase.fetchAllBids(jobId);
                res.json({ success: true, bids: bids });
            }
            catch (error) {
                console.error(error);
                res.json({ success: false });
            }
        });
    }
}
exports.BidController = BidController;
