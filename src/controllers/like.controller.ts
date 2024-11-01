import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import { asyncHandler } from '../middlewares/async';
import likeService from '../services/like.service';
import ErrorResponse from '../utils/errorResponse';
import { statusCode } from '../utils/statusCodes';

export const getLikesCount = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { articleId } = req.params;

      const likes = await likeService.getLikes(articleId);

      res.status(statusCode.success).json({ likes });
    } catch (error: any) {
      next(
        new ErrorResponse(
          error.message,
          statusCode.unprocessable
        )
      );
    }
  }
);

export const likeArticle = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { articleId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new ErrorResponse(
          'User not authenticated',
          statusCode.unauthorized
        )
      );
    }

    try {
      const likes = await likeService.incrementLike(
        articleId
      );
      res.status(statusCode.success).json({ likes });
    } catch (error: any) {
      next(
        new ErrorResponse(
          error.message,
          statusCode.unprocessable
        )
      );
    }
  }
);

export const unlikeArticle = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { articleId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new ErrorResponse(
          'User not authenticated',
          statusCode.unauthorized
        )
      );
    }

    try {
      const likes = await likeService.decrementLike(
        articleId
      );
      res.status(statusCode.success).json({ likes });
    } catch (error: any) {
      next(
        new ErrorResponse(
          error.message,
          statusCode.unprocessable
        )
      );
    }
  }
);

export const getUserLikeStatus = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { articleId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new ErrorResponse(
          'User not authenticated',
          statusCode.unauthorized
        )
      );
    }

    const userKey = `like:${userId}:${articleId}`;
    const likeStatus = await redisClient.get(userKey);

    res
      .status(statusCode.success)
      .json({ liked: likeStatus ? true : false });
  }
);
