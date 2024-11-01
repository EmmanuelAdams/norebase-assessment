import mongoose from 'mongoose';

const mongoURL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

if (!mongoURL) {
  console.error(
    'Error: MongoDB connection URI not found in .env file.'
  );
  process.exit(1);
}

mongoose
  .connect(mongoURL)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      const env = process.env.NODE_ENV || 'production';
      console.log(
        `🛡 MongoDB connected successfully in ${env} mode 🛡`
      );
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

const closeMongoDBConnection = () => {
  mongoose.disconnect().then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
};

process.on('SIGINT', closeMongoDBConnection);
process.on('SIGTERM', closeMongoDBConnection);

export default mongoose;
