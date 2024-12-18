"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../application/services/jwt");
const jwtInstance = new jwt_1.JWT();
const userAuthMiddleware = (req, res, next) => {
    var _a;
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    try {
        const decoded = jwtInstance.verifyAccessToken(token);
        req.user = decoded;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'client') {
            return next();
        }
        else {
            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        }
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
};
exports.default = userAuthMiddleware;
