import { Request, Response, NextFunction } from 'express'; 
import { JWT } from '../../application/services/jwt'; 

const jwtInstance = new JWT();

const verifyTokenMiddleware = (req: Request & { user?: { id: string; role: string; } }, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    // Check if authHeader is a string
    if (typeof authHeader === 'string') {
        const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer" scheme

        if (!token) {
            return res.status(401).json({ message: 'Access token is missing' });
        }

        try {
            const decoded = jwtInstance.verifyAccessToken(token); // Verify the access token
            req.user = decoded; // Assign user data from token
            return next(); // Proceed if the token is valid
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired access token' });
        }
    }

    return res.status(401).json({ message: 'Authorization header is missing or invalid' });
};

export default verifyTokenMiddleware;
