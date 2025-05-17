const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500 // Increased from 100 to 500 requests per windowMs
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'], // Add your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://heramb15012006:coco1501@cluster0.wwqej5l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    console.log('✅🚀Connected to MongoDB🚀✅');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

// Import Models
const Form = require('./models/Form');
const User = require('./models/User');
const FormData = require('./models/FormData'); // Add missing FormData model

// Import routes
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

// Apply error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅🚀Server running on port ${PORT} ✅🚀`);
}); 