"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const reviewRepository_1 = require("../../../infrastructure/repositories/userRepositories/reviewRepository");
const reviewUseCase_1 = require("../../../application/useCases/user/reviewUseCase/reviewUseCase");
const reviewController_1 = require("../../controllers/userControllers/reviewController/reviewController");
const reviewModel_1 = __importDefault(require("../../../infrastructure/models/reviewModel"));
const reviewRepository = new reviewRepository_1.ReviewRepository(reviewModel_1.default);
const reviewUseCase = new reviewUseCase_1.ReviewUseCase(reviewRepository);
const reviewController = new reviewController_1.ReviewController(reviewUseCase);
const router = express_1.default.Router();
router.post('/submit-review', auth_1.default, reviewController.submitReview.bind(reviewController));
exports.default = router;
