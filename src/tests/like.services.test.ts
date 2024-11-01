import { redisClient } from '../config/redis';
import { Article } from '../models/article.model';
import likeService from '../services/like.service';
import ErrorResponse from '../utils/errorResponse';

jest.mock('../models/article.model.ts');
jest.mock('../config/redis.ts');

describe('Like Service', () => {
  beforeAll(async () => {
    await redisClient.connect();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLikes', () => {
    it('should return cached like count if available', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(
        '10'
      );

      const likes = await likeService.getLikes('12345');
      expect(likes).toBe(10);
      expect(redisClient.get).toHaveBeenCalledWith(
        'article:12345:likes'
      );
    });

    it('should throw an error if article is not found in getLikes', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(
        null
      );
      (Article.findById as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        likeService.getLikes('12345')
      ).rejects.toThrow(ErrorResponse);
    });

    it('should return like count from MongoDB if cache is empty', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(
        null
      );
      (Article.findById as jest.Mock).mockResolvedValue({
        likes: 15,
      });
      (redisClient.setex as jest.Mock).mockResolvedValue(
        true
      );

      const likes = await likeService.getLikes('12345');
      expect(likes).toBe(15);
      expect(Article.findById).toHaveBeenCalledWith(
        '12345'
      );
      expect(redisClient.setex).toHaveBeenCalledWith(
        'article:12345:likes',
        5,
        '15'
      );
    });
  });

  describe('incrementLike', () => {
    it('should increment temporary like count in Redis and return total likes', async () => {
      (redisClient.incr as jest.Mock).mockResolvedValue(1);
      (redisClient.get as jest.Mock).mockResolvedValue('5');
      jest
        .spyOn(Article, 'findById')
        .mockResolvedValue({ likes: 10 });

      const likes = await likeService.incrementLike(
        '12345'
      );

      expect(likes).toBe(15);
      expect(redisClient.incr).toHaveBeenCalledWith(
        'article:12345:likeCountTemp'
      );
      expect(redisClient.get).toHaveBeenCalledWith(
        'article:12345:likeCountTemp'
      );
      expect(Article.findById).toHaveBeenCalledWith(
        '12345'
      );
    });

    it('should throw an error if article is not found in incrementLike', async () => {
      jest
        .spyOn(Article, 'findById')
        .mockResolvedValue(null);

      await expect(
        likeService.incrementLike('12345')
      ).rejects.toThrow(ErrorResponse);
    });
  });

  describe('decrementLike', () => {
    it('should decrement temporary like count in Redis and return total likes', async () => {
      (redisClient.decr as jest.Mock).mockResolvedValue(-1);

      jest
        .spyOn(Article, 'findById')
        .mockResolvedValue({ likes: 10 });

      const likes = await likeService.decrementLike(
        '12345'
      );

      expect(likes).toBe(9);
      expect(redisClient.decr).toHaveBeenCalledWith(
        'article:12345:likeCountTemp'
      );
    });

    it('should throw an error if article is not found in decrementLike', async () => {
      jest
        .spyOn(Article, 'findById')
        .mockResolvedValue(null);

      await expect(
        likeService.decrementLike('12345')
      ).rejects.toThrow(ErrorResponse);
    });
  });

  describe('syncLikesToMongoDB', () => {
    it('should sync temporary likes from Redis to MongoDB and reset Redis temp count', async () => {
      (redisClient.keys as jest.Mock).mockResolvedValue([
        'article:12345:likeCountTemp',
      ]);
      (redisClient.get as jest.Mock).mockResolvedValue('3');
      (
        Article.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue({ likes: 13 });

      await likeService.syncLikesToMongoDB();
      expect(
        Article.findByIdAndUpdate
      ).toHaveBeenCalledWith('12345', {
        $inc: { likes: 3 },
      });
      expect(redisClient.del).toHaveBeenCalledWith(
        'article:12345:likeCountTemp'
      );
    });
  });
});
