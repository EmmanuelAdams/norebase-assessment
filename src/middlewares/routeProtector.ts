import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse';
import { statusCode } from '../utils/statusCodes';

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ErrorResponse(
        'Not authorized to access this route',
        statusCode.unauthorized
      )
    );
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
    };

    req.user = decoded as { id: string };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new ErrorResponse(
          'Token has expired, please log in again',
          statusCode.unauthorized
        )
      );
    }
    next(
      new ErrorResponse(
        'Not authorized to access this route',
        statusCode.unauthorized
      )
    );
  }
};
