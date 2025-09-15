const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');

async function startServer() {
  console.log('Starting in-memory MongoDB...');
  
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('In-memory MongoDB started at:', uri);
    
    // Set the MongoDB URI as environment variable
    process.env.MONGO_URI = uri;
    process.env.NODE_ENV = 'development';
    
    // Start the server
    console.log('Starting Express server...');
    require('./src/server.js');
    
  } catch (error) {
    console.error('Failed to start development server:', error);
    process.exit(1);
  }
}

startServer();