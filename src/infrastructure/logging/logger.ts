import express, { Express, Request, Response, NextFunction } from 'express';
import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;
    
    // Include additional metadata if present
    if (Object.keys(meta).length > 0) {
      logMessage += `\nMetadata: ${JSON.stringify(meta)}`;
    }
    
    // Include error stack if available
    if (stack) {
      logMessage += `\nError Stack: ${stack}`;
    }
    
    return logMessage;
  })
);

// Create a logger
const logger = winston.createLogger({
  level: 'error', // Focusing on error level
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),

    // Daily rotate file transport for error logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m', // Max file size
      maxFiles: '14d', // Keep logs for 14 days
      zippedArchive: true
    })
  ],
  
  // Unhandled exception handler
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log') 
    })
  ],
  
  // Unhandled rejection handler
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log') 
    })
  ],

  // Exit on handled exceptions
  exitOnError: false
});

// Global error handling middleware for Express
export function globalErrorHandler(app: any) {
  // Catch and log synchronous errors in route handlers
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled Error', {
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query
    });

    // Respond with error
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred'
    });
  });

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : 'No stack trace'
    });
  });

  // Catch uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack
    });
    
    // Graceful shutdown
    process.exit(1);
  });
}

export default logger;