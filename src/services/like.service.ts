import { statusCode } from './../utils/statusCodes';
import { Article } from '../models/article.model';
import { redisClient } from '../config/redis';
import ErrorResponse from '../utils/errorResponse';

class LikeService {
  constructor() {
    this.startSyncInterval();
  }

  async getLikes(articleId: string): Promise<number> {
    const cachedLikes = await redisClient.get(
      `article:${articleId}:likes`
    );
    if (cachedLikes) {
      return parseInt(cachedLikes, 10);
    }

    const article = await Article.findById(articleId);
    if (!article) {
      throw new ErrorResponse(
        `Article with ID ${articleId} not found.`,
        statusCode.notFound
      );
    }

    const likeCount = article.likes;

    await redisClient.setex(
      `article:${articleId}:likes`,
      5,
      likeCount.toString()
    );

    return likeCount;
  }

  async syncLikesToMongoDB(): Promise<void> {
    const keys = await redisClient.keys(
      'article:*:likeCountTemp'
    );

    if (Array.isArray(keys) && keys.length > 0) {
      for (const key of keys) {
        const articleId = key.split(':')[1];
        const tempLikes = await redisClient.get(key);

        if (tempLikes) {
          await Article.findByIdAndUpdate(articleId, {
            $inc: { likes: parseInt(tempLikes, 10) },
          });
          await redisClient.del(key);
        }
      }
    }
  }

  async incrementLike(articleId: string): Promise<number> {
    const article = await Article.findById(articleId);
    if (!article) {
      throw new ErrorResponse(
        `Article with ID ${articleId} not found.`,
        statusCode.notFound
      );
    }

    await redisClient.incr(
      `article:${articleId}:likeCountTemp`
    );
    const currentLikes = await redisClient.get(
      `article:${articleId}:likeCountTemp`
    );
    const totalLikes =
      (parseInt(currentLikes ?? '0', 10) || 0) +
      article.likes;

    return totalLikes;
  }

  async decrementLike(articleId: string): Promise<number> {
    const article = await Article.findById(articleId);
    if (!article) {
      throw new ErrorResponse(
        `Article with ID ${articleId} not found.`,
        statusCode.notFound
      );
    }

    const tempLikes = await redisClient.decr(
      `article:${articleId}:likeCountTemp`
    );

    const totalLikes = Math.max(
      0,
      article.likes + tempLikes
    );

    return totalLikes;
  }

  private startSyncInterval(): void {
    setInterval(() => this.syncLikesToMongoDB(), 60000);
  }
}

export default new LikeService();
