require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route modules
const studentsRouter = require('./routes/students');
const menuItemsRouter = require('./routes/menuItems');
const ordersRouter = require('./routes/orders');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    'mongodb://127.0.0.1:27017/campus-food-api';

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Campus Food API is running!' });
});

// Attach routes
app.use('/students', studentsRouter);
app.use('/menu-items', menuItemsRouter);
app.use('/orders', ordersRouter);
app.use('/analytics', analyticsRouter);

// Database connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`MongoDB connection error for ${MONGODB_URI}:`, err.message);
    });
