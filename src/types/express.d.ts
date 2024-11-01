import 'express';

declare module 'express' {
  interface Request {
    deviceInfo?: {
      os: string;
      browser: string;
      platform: string;
    };
    user?: {
      id: string;
    };
  }
}
