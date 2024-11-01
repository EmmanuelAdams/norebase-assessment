import rateLimit from 'express-rate-limit';

export const likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests. Please try again later.',
});
