"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bidController_1 = require("../../controllers/userControllers/bidController/bidController");
const bidRepository_1 = require("../../../infrastructure/repositories/userRepositories/bidRepository");
const bidUseCase_1 = require("../../../application/useCases/user/bidUseCase/bidUseCase");
const bidModel_1 = __importDefault(require("../../../infrastructure/models/bidModel"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const bidRepository = new bidRepository_1.BidRepository(bidModel_1.default);
const bidUseCase = new bidUseCase_1.BidUseCase(bidRepository);
const bidController = new bidController_1.BidController(bidUseCase);
const router = express_1.default.Router();
router.post('/all-bids', auth_1.default, bidController.fetchAllBids.bind(bidController));
exports.default = router;
