const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("MONGO_URI from .env:", process.env.MONGO_URI);

    // Try to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔄 Retrying MongoDB connection in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(async () => {
      try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected on retry');
      } catch (retryError) {
        console.error('❌ MongoDB retry failed:', retryError.message);
        console.log('⚠️  Server will continue without database - some features may not work');
      }
    }, 5000);
  }
};

module.exports = connectDB;
