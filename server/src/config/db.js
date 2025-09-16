const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/icecream_shop';
    
    console.log('🔌 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log('📦 MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Tip: Make sure MongoDB is running on your system');
    console.log('💡 You can install MongoDB or use MongoDB Atlas (cloud)');
    throw error;
  }
};

module.exports = connectDB;