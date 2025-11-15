const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stanley-moore');
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@stanleymoore.com',
      password: 'admin123',
      role: 'admin'
    });
    
    // Create sample products
    await Product.create([
      {
        name: "Ankara Print Dashiki",
        price: 89.99,
        stock: 25,
        category: "men",
        collection: "african-heritage",
        image: "https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Ankara+Dashiki",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Royal Blue", "Gold", "Green"],
        description: "Authentic African dashiki with traditional Ankara print patterns",
        featured: true
      },
      {
        name: "Kente Cloth Dress",
        price: 149.99,
        stock: 12,
        category: "women",
        collection: "african-heritage",
        image: "https://via.placeholder.com/400x300/DAA520/FFFFFF?text=Kente+Dress",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Traditional Kente", "Royal Purple", "Gold Accent"],
        description: "Elegant dress featuring authentic Ghanaian Kente cloth patterns",
        featured: true
      },
      {
        name: "Mudcloth Jacket",
        price: 129.99,
        stock: 5,
        category: "unisex",
        collection: "african-heritage",
        image: "https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Mudcloth+Jacket",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Natural Brown", "Black", "Cream"],
        description: "Handcrafted jacket featuring traditional Malian mudcloth patterns",
        featured: true
      }
    ]);
    
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();