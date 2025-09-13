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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🟢 Server running on', PORT));
