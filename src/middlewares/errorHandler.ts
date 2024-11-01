import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import ErrorResponse from '../utils/errorResponse';
import { statusCode } from '../utils/statusCodes';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, statusCode.notFound);
  }

  if (err instanceof MongoError && err.code === 11000) {
    let message = 'Duplicate field value entered';
    if (err.message.includes('username')) {
      message = 'Username already taken';
    }
    if (err.message.includes('email')) {
      message = 'Email already taken';
    }
    error = new ErrorResponse(
      message,
      statusCode.badRequest
    );
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(
      (val: any) => val.message
    );
    const message = messages.join(', ');
    error = new ErrorResponse(
      message,
      statusCode.badRequest
    );
  }

  res
    .status(error.statusCode || statusCode.unprocessable)
    .json({
      success: false,
      error: error.message || 'Unprocessable entity',
      createdAt: (
        err.createdAt || new Date()
      ).toISOString(),
      updatedAt: (
        err.updatedAt || new Date()
      ).toISOString(),
    });
};

export default errorHandler;
