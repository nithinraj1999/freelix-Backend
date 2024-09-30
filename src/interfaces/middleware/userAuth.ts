// // tokenMiddleware.ts
// import { Request, Response, NextFunction } from 'express'; // Import types from express
// import { JWT } from '../../application/services/jwt'; // Adjust the path to where your JWT class is located

// const jwtInstance = new JWT();

// const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//   // Check for access token in the Authorization header
//   const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"

//   if (!token) {
//     res.status(401).json({ message: 'Access token is missing' });
//     return;
//   }

//   // Verify the access token
//   try {
//     const decoded = jwtInstance.verifyAccessToken(token); // Validate the access token
//     req.user = decoded; // Attach decoded user info to the request object
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     // If access token is expired or invalid, check for refresh token
//     const refreshToken = req.cookies['refreshToken']; // Assuming you store refresh token in cookies
//     if (!refreshToken) {
//       res.status(403).json({ message: 'Refresh token is missing' });
//       return;
//     }

//     try {
//       const decoded = jwtInstance.verifyRefreshToken(refreshToken); // Validate refresh token
//       const newAccessToken = jwtInstance.generateAccessToken({ id: decoded.id }); // Generate new access token
//       res.setHeader('Authorization', `Bearer ${newAccessToken}`); // Set new access token in the response header
//       req.user = decoded; // Attach user info to the request object
//       next(); // Proceed to the next middleware or route handler
//     } catch (refreshError) {
//       res.status(403).json({ message: 'Invalid or expired refresh token' });
//     }
//   }
// };

// export default verifyTokenMiddleware;
