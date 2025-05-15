import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../CustomError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = require('../utils/logger').default;
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof CustomError) {
    return res.status(err.code).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.path
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path
  });
};