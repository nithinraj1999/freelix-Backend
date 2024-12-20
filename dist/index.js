"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongodbConnection_1 = require("./infrastructure/database/mongodbConnection");
const userRoute_1 = __importDefault(require("./interfaces/routes/userRoute"));
const adminRoute_1 = __importDefault(require("./interfaces/routes/adminRoute"));
const freelancerRoute_1 = __importDefault(require("./interfaces/routes/freelancerRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_http_1 = require("node:http");
const socket_1 = require("./application/services/socket");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = (0, socket_1.initSocket)(server);
exports.io = io;
app.use((0, cors_1.default)({
    origin: "https://freelix-frontend-if5u.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((0, morgan_1.default)("tiny"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ limit: '2mb', extended: true }));
(0, mongodbConnection_1.connectToMongoDB)();
app.use('/api', userRoute_1.default);
app.use('/api/admin', adminRoute_1.default);
app.use('/api/freelancer', freelancerRoute_1.default);
server.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
