import { Request, Response, NextFunction } from 'express';
import { JWT } from '../../application/services/jwt';

const jwtInstance = new JWT();

const authMiddleware = (req: Request & { user?: { id: string; role: string; } }, res: Response, next: NextFunction) => {
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
        if (req.user?.role === 'admin') {
            return next(); 
        } else {
            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
};

export default authMiddleware;
