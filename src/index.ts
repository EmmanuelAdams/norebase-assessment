import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swaggerSpec';
import likeRoutes from './routes/like.routes';
import ErrorResponse from './utils/errorResponse';
import { statusCode } from './utils/statusCodes';
import errorHandler from './middlewares/errorHandler';

dotenv.config();
require('./config/db');

const app: Application = express();

const requiredEnvVars = [
  'PORT',
  'BASE_URL',
  'MONGO_URI',
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new ErrorResponse(
      `Environment variable ${varName} is missing`,
      statusCode.badRequest
    );
  }
}

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use('/api/v1/articles', likeRoutes);

app.use(errorHandler);

export default app;
