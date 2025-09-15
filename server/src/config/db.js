const mongoose = require('mongoose');
let memoryServerInstance = null;

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const connectDB = async () => {
  const configuredUri = process.env.MONGO_URI;
  const shouldUseMemory = !configuredUri || configuredUri === 'memory';
  try {
    if (shouldUseMemory) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri('icecreamdb');
      console.log('Starting in-memory MongoDB at:', memUri);
      await connectWithUri(memUri);
    } else {
      const uri = configuredUri || 'mongodb://127.0.0.1:27017/icecreamdb';
      console.log('Connecting to MongoDB:', uri);
      await connectWithUri(uri);
    }
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
