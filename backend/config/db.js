const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('⚠️  MONGO_URI / MONGODB_URI is not set in environment variables. Database connection skipped.');
      return false;
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'ai_career_mentor',
    });
    console.log('MongoDB connected successfully');
    console.log(`Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return false;
  }
};

module.exports = connectDB;
