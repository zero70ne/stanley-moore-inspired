const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try local MongoDB first, fallback to in-memory for testing
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stanley-moore';
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    } catch (localError) {
      console.log('⚠️  Local MongoDB not available, using in-memory database for testing');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`📊 In-Memory MongoDB Connected for testing`);
      
      // Seed data for testing
      setTimeout(async () => {
        const User = require('../models/User');
        const Product = require('../models/Product');
        
        // Create admin user if not exists
        const adminExists = await User.findOne({ email: 'admin@stanleymoore.com' });
        if (!adminExists) {
          await User.create({
            name: 'Admin User',
            email: 'admin@stanleymoore.com',
            password: 'admin123',
            role: 'admin'
          });
          console.log('✅ Admin user created');
        }
        
        // Create sample products if none exist
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
          await Product.create([
            {
              name: "Ankara Print Dashiki",
              price: 89.99,
              stock: 25,
              category: "men",
              collection: "african-heritage",
              description: "Authentic African dashiki with traditional Ankara print patterns",
              featured: true
            },
            {
              name: "Kente Cloth Dress",
              price: 149.99,
              stock: 12,
              category: "women",
              collection: "african-heritage", 
              description: "Elegant dress featuring authentic Ghanaian Kente cloth patterns",
              featured: true
            },
            {
              name: "Mudcloth Jacket",
              price: 129.99,
              stock: 5,
              category: "unisex",
              collection: "african-heritage",
              description: "Handcrafted jacket featuring traditional Malian mudcloth patterns",
              featured: true
            }
          ]);
          console.log('✅ Sample products created');
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;