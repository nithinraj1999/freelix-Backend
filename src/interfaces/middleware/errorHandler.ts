import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logging/logger';
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
  
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

 
 
};
