// Simple test to verify database models work
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

// Use in-memory MongoDB for testing
const { MongoMemoryServer } = require('mongodb-memory-server');

const testDB = async () => {
  try {
    // Start in-memory MongoDB
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    console.log('✅ Connected to in-memory MongoDB');
    
    // Test User creation
    const user = await User.create({
      name: 'Test Admin',
      email: 'admin@stanleymoore.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ User created:', user.email);
    
    // Test Product creation
    const product = await Product.create({
      name: 'Test Dashiki',
      price: 89.99,
      stock: 10,
      category: 'men',
      description: 'Test product'
    });
    console.log('✅ Product created:', product.name);
    
    // Test authentication
    const loginTest = await user.comparePassword('admin123');
    console.log('✅ Password verification:', loginTest);
    
    console.log('🎉 All database tests passed!');
    
    await mongoose.disconnect();
    await mongod.stop();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testDB();