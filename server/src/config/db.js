const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/icecream-shop';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('⚠️  MongoDB connection failed:', error.message);
    console.log('⚠️  Running without database - some features may not work');
    // Don't exit the process, let the server run without DB for now
  }
};

module.exports = connectDB;
