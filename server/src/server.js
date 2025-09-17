require('dotenv').config({ path: __dirname + '/../.env' });

const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect DB
connectDB().catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  console.log('\n🔧 Setup Instructions:');
  console.log('1. Install MongoDB: sudo apt install mongodb');
  console.log('2. Start MongoDB: sudo systemctl start mongodb');
  console.log('3. Or use MongoDB Atlas: https://cloud.mongodb.com/');
  console.log('4. Update MONGO_URI in .env file\n');
  process.exit(1);
});

const PORT = process.env.PORT || 5001;

// Added error handling for server startup
const server = app.listen(PORT, () => {
  console.log('🟢 Server running on port', PORT);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⛔ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});