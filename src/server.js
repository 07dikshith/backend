const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Create express app
const app = express();

// ✅ Allow Firebase frontend to access backend
app.use(
  cors({
    origin: ['https://foodproc-143be.web.app'], // your Firebase site
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
const connectDB = require('./config/db');  // ✅ use ./ not ../
connectDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
