import { Request, Response, NextFunction } from 'express';
import { log } from 'winston';
interface CustomError extends Error {
  status?: number;
}

export const errorHandlingMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  
  
) => {
  // Log error details
  console.log("hhhh",req.method);
  
  

 
 
};
