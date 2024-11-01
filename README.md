# Article Likes API

This is an Express-based API for managing likes on articles. It provides endpoints to increment and decrement likes, check the like count, and determine a user's like status for specific articles. The application utilizes Redis for caching and MongoDB for persistent storage.

## Features

- **Get Likes Count**: Retrieve the total number of likes for a specific article.
- **Like an Article**: Increment the like count for an article.
- **Unlike an Article**: Decrement the like count for an article.
- **Check User Like Status**: Determine whether a specific user has liked an article.

## Technologies Used

- Node.js
- Express
- MongoDB (with Mongoose)
- Redis
- Swagger (for API documentation)
- dotenv (for environment variable management)
- Jest (for testing)

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm or yarn
- MongoDB (running instance)
- Redis (running instance)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Documentation](#documentation)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nuture-Technologies/Mbag-Mfbank-Infrastructure.git

   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. To start the development server, run:

   ```bash
   npm run dev
   ```

2. For production, build and start the application:

   ```bash
   npm run build
   ```

3. To run the tests, use the following command:

   ```bash
    npm test
   ```

## Environment Variables

1. Create a .env file in the root directory and add the required environment variables:
   ```makefile
   PORT=3000
   BASE_URL=http://localhost:3000
   MONGO_URI=mongodb://<username>:<password>@localhost:27017/<database>
   MONGO_USERNAME=<your-mongo-username>
   MONGO_PASSWORD=<your-mongo-password>
   ```

## Scripts

- build: Compiles the TypeScript files.
- start: Runs the compiled JavaScript code.
- dev: Starts the server in development mode with hot reloading.

## API Endpoints

The backend exposes the following API endpoints:

- **GET** `/api/v1/articles/{articleId}/likes`: Get the like count for a specific article.
- **POST** `/api/v1/articles/{articleId}/like`: Like an article (user must be authenticated).
- **POST** `/api/v1/articles/{articleId}/unlike`: Unlike an article (user must be authenticated).
- **GET** `/api/v1/articles/{articleId}/like-status`: Get the like status for an article by the authenticated user.

## Documentation

Open your browser and go to http://localhost:3000/api-docs to access the API documentation.
