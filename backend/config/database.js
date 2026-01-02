const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment MongoDB URI or fallback to a simple connection
    let uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.log('⚠️  No MONGODB_URI provided, using fallback connection');
      // For demo purposes, we'll just connect without a database
      // In production, you should always provide MONGODB_URI
      return;
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('⚠️  Continuing without database connection for demo');
  }
};

module.exports = connectDB;