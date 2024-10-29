import { Request, Response, NextFunction } from 'express';
import { JWT } from '../../application/services/jwt';

const jwtInstance = new JWT();

const freelancerAuth = (req: Request & { user?: { id: string; role: string; } }, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    // Check if authHeader is a string and contains the Bearer scheme
    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer" scheme

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded = jwtInstance.verifyAccessToken(token); // Verify the access token
        req.user = decoded; // Assign user data from token

        // Check if the user has the "admin" role
        if (req.user?.role === 'freelancer') {
            return next(); // Proceed if the role is "admin"
        } else {
            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
};

export default freelancerAuth;
