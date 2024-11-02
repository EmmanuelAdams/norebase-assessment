import { statusCode } from './../utils/statusCodes';
import express, { Request, Response } from 'express';
const router = express.Router();

router.get(
  '/server-status',
  (req: Request, res: Response) => {
    res.status(statusCode.success).json({
      success: true,
      message: 'Norebase Assessment API is live',
    });
  }
);

export default router;
