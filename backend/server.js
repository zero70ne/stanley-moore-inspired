const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { paystackService } = require('./services/paymentService');
const connectDB = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { upload, processImage } = require('./middleware/upload');
const { sendOrderConfirmation, sendShippingNotification, sendPasswordReset } = require('./services/emailService');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};



const brandInfo = {
  name: "STANLEY MOORE INSPIRED",
  slogan: "Celebrating African Heritage Through Fashion",
  description: "Premium African-inspired clothing that honors tradition while embracing modern style",
  logo: "/images/logo.png"
};

app.get('/api/brand', (req, res) => {
  res.json(brandInfo);
});

app.get('/api/products', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    let query = {};
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    let productsQuery = Product.find(query);
    
    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          productsQuery = productsQuery.sort({ price: 1 });
          break;
        case 'price-high':
          productsQuery = productsQuery.sort({ price: -1 });
          break;
        case 'name':
          productsQuery = productsQuery.sort({ name: 1 });
          break;
        default:
          productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    }
    
    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );
    
    await sendPasswordReset(email, resetToken);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Invalid token' });
    }
    
    user.password = password;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
app.get('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/products', authenticateToken, isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData || '{}');
    const images = [];
    
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const filename = `${Date.now()}-${i}.jpg`;
        const imagePath = await processImage(file.buffer, filename);
        images.push(imagePath);
      }
    }
    
    const product = await Product.create({
      ...productData,
      images,
      mainImage: images[0] || null
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/products/:id/images', authenticateToken, isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const newImages = [];
    
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const filename = `${Date.now()}-${i}.jpg`;
        const imagePath = await processImage(file.buffer, filename);
        newImages.push(imagePath);
      }
    }
    
    product.images = [...(product.images || []), ...newImages];
    if (!product.mainImage && newImages.length > 0) {
      product.mainImage = newImages[0];
    }
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    const ordersWithUsers = orders.map(order => ({
      ...order.toObject(),
      customer: order.userId.name,
      email: order.userId.email
    }));
    res.json(ordersWithUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { trackingNumber, ...updateData } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('userId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Send shipping notification if status changed to shipped
    if (updateData.status === 'shipped' && trackingNumber) {
      await sendShippingNotification(order.userId.email, order.userId.name, order, trackingNumber);
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment routes - Paystack
app.post('/api/payment/initialize', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'NGN' } = req.body;
    const user = await User.findById(req.user.id);
    
    const payment = await paystackService.initializePayment(
      user.email,
      amount,
      currency
    );
    
    res.json({
      authorization_url: payment.authorization_url,
      access_code: payment.access_code,
      reference: payment.reference
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment/verify', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.body;
    
    const verification = await paystackService.verifyPayment(reference);
    
    if (verification.status === 'success') {
      res.json({ 
        success: true, 
        amount: verification.amount / 100, // Convert from kobo
        reference: verification.reference 
      });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total, paystackReference } = req.body;
    
    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
      paymentIntentId: paystackReference,
      paymentMethod: 'paystack',
      status: 'confirmed'
    });
    
    // Send order confirmation email
    const user = await User.findById(req.user.id);
    await sendOrderConfirmation(user.email, user.name, order);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎯 STANLEY MOORE INSPIRED Server running on http://localhost:${PORT}`);
  console.log('💳 Payment Method: Paystack (Nigeria)');
  console.log('📊 Available endpoints:');
  console.log('  - GET /api/products');
  console.log('  - POST /api/auth/login');
  console.log('  - POST /api/auth/register');
  console.log('  - POST /api/payment/initialize');
  console.log('  - POST /api/payment/verify');
  console.log('  - GET /api/admin/* (admin only)');
});