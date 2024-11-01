import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Like Button API',
      version: '1.0.0',
      description:
        'Norebase API documentation for the Like button feature',
    },
  },
  tags: [
    {
      name: 'Like',
      description:
        'Endpoints related to user like interactions with articles',
    },
  ],

  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
