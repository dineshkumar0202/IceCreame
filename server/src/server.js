require('dotenv').config({ path: __dirname + '/../.env' }); // must be first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Connect DB
connectDB();

// Function to start server with port fallback
async function startServer() {
    const preferredPort = process.env.PORT || 5000;
    const alternativePorts = [5001, 5002, 5003, 3000, 3001, 8000, 8080];
    const portsToTry = [preferredPort, ...alternativePorts];
    
    for (const port of portsToTry) {
        try {
            await new Promise((resolve, reject) => {
                const server = app.listen(port, () => {
                    console.log(`🟢 Server running on port ${port}`);
                    if (port !== preferredPort) {
                        console.log(`⚠️  Note: Using alternative port ${port} instead of ${preferredPort}`);
                    }
                    resolve(server);
                }).on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        console.log(`❌ Port ${port} is already in use, trying next port...`);
                        reject(err);
                    } else {
                        console.error('Server error:', err);
                        reject(err);
                    }
                });
            });
            return; // Successfully started server
        } catch (err) {
            if (err.code !== 'EADDRINUSE') {
                console.error('Failed to start server:', err);
                process.exit(1);
            }
            // Continue to next port if EADDRINUSE
        }
    }
    
    console.log('❌ No available ports found. All attempted ports are in use.');
    console.log('💡 Try running one of these commands to free up ports:');
    console.log('   pkill -f "node.*server"');
    console.log('   pkill -f nodemon');
    console.log('   Or restart your terminal/IDE');
    process.exit(1);
}

// Start the server
startServer();
