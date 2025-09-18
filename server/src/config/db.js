const mongoose = require('mongoose');
let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/icecream_shop';
    const useInMemoryDb = process.env.USE_IN_MEMORY_DB === 'true' || (!process.env.MONGO_URI && process.env.NODE_ENV !== 'production');

    console.log('🔌 Attempting to connect to MongoDB...');
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
      });
      console.log('📦 MongoDB Connected:', conn.connection.host);
      return;
    } catch (primaryErr) {
      console.error('❌ Primary MongoDB connection failed:', primaryErr.message);
      if (!useInMemoryDb) throw primaryErr;
    }

    // Fallback to in-memory MongoDB for development
    console.log('🧪 Starting in-memory MongoDB for development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const memConn = await mongoose.connect(memoryUri);
    console.log('📦 In-memory MongoDB Connected:', memConn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Tip: Make sure MongoDB is running on your system');
    console.log('💡 You can install MongoDB or use MongoDB Atlas (cloud)');
    throw error;
  }
};

// Gracefully stop in-memory MongoDB on process exit
process.on('SIGINT', async () => {
  try {
    if (mongoMemoryServer) await mongoMemoryServer.stop();
  } finally {
    process.exit(0);
  }
});

module.exports = connectDB;