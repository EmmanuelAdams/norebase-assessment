import { Router } from 'express';
import {
  getLikesCount,
  getUserLikeStatus,
  likeArticle,
  unlikeArticle,
} from '../controllers/like.controller';
import { likeLimiter } from '../middlewares/likeLimiter';
import { protect } from '../middlewares/routeProtector';

const router = Router();

/**
 * @swagger
 * /{articleId}/likes:
 *   get:
 *     summary: Get the like count for a specific article
 *     tags:
 *      - Like
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to retrieve like count for
 *     responses:
 *       200:
 *         description: Successfully retrieved like count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articleId:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *       404:
 *         description: Article not found
 */
router.get('/:articleId/likes', likeLimiter, getLikesCount);

/**
 * @swagger
 * /{articleId}/like:
 *   post:
 *     summary: Increment the like count for a specific article
 *     tags:
 *      - Like
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to like
 *     responses:
 *       200:
 *         description: Successfully liked the article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articleId:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Article not found
 *       429:
 *         description: Rate limit exceeded
 */
router.post(
  '/:articleId/like',
  likeLimiter,
  protect,
  likeArticle
);

/**
 * @swagger
 * /{articleId}/unlike:
 *   post:
 *     summary: Decrement the like count for a specific article
 *     tags:
 *      - Like
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to unlike
 *     responses:
 *       200:
 *         description: Successfully unliked the article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articleId:
 *                   type: string
 *                 likeCount:
 *                   type: number
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Article not found
 */
router.post('/:articleId/unlike', protect, unlikeArticle);

/**
 * @swagger
 * /{articleId}/like-status:
 *   get:
 *     summary: Get the like status for an article by the authenticated user
 *     tags:
 *      - Like
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to check like status for
 *     responses:
 *       200:
 *         description: Successfully retrieved like status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Article not found
 */
router.get(
  '/:articleId/like-status',
  protect,
  getUserLikeStatus
);

export default router;
