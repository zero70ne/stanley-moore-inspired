import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import apiService from '../services/api';
import ImageUpload from '../components/ImageUpload';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [productsData, ordersData, usersData] = await Promise.all([
        apiService.getAdminProducts(),
        apiService.getAdminOrders(),
        apiService.getUsers()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  const addProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      try {
        const productData = {
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        };
        
        const product = await apiService.createProduct(productData, selectedImages);
        setProducts([...products, product]);
        setNewProduct({ name: '', price: '', stock: '', category: '' });
        setSelectedImages([]);
      } catch (error) {
        console.error('Failed to add product:', error);
      }
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const product = await apiService.updateProduct(id, {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock)
      });
      setProducts(products.map(p => p.id === id ? product : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await apiService.updateOrder(id, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const toggleUserStatus = (id) => {
    // Note: This would need a backend endpoint to update user status
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    marginRight: '10px',
    backgroundColor: activeTab === tab ? '#333' : '#ccc',
    color: activeTab === tab ? 'white' : 'black',
    border: 'none',
    cursor: 'pointer'
  });

  const buttonStyle = {
    padding: '5px 10px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('dashboard')} style={tabStyle('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('products')} style={tabStyle('products')}>Products</button>
        <button onClick={() => setActiveTab('orders')} style={tabStyle('orders')}>Orders</button>
        <button onClick={() => setActiveTab('users')} style={tabStyle('users')}>Users</button>
        <button onClick={() => setActiveTab('analytics')} style={tabStyle('analytics')}>Analytics</button>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <h2>Dashboard Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
              <h3>Total Revenue</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#fff0f0', borderRadius: '5px' }}>
              <h3>Pending Orders</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{pendingOrders}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f0fff0', borderRadius: '5px' }}>
              <h3>Total Products</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{products.length}</p>
            </div>
          </div>
          
          {lowStockProducts.length > 0 && (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
              <h3 style={{ color: '#856404' }}>⚠️ Low Stock Alerts</h3>
              {lowStockProducts.map(product => (
                <p key={product.id} style={{ margin: '5px 0' }}>
                  {product.name} - Only {product.stock} left in stock
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h2>Product Management</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            <h3>Add New Product</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd' }}
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd' }}
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd' }}
                />
                <input
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ddd' }}
                />
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0' }}>Product Images</h4>
                <ImageUpload onImagesSelected={setSelectedImages} />
              </div>
              
              <button onClick={addProduct} style={{...buttonStyle, backgroundColor: '#28a745', color: 'white'}}>Add Product</button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stock</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Images</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {editingProduct === product.id ? (
                      <input defaultValue={product.name} onBlur={(e) => updateProduct(product.id, {...product, name: e.target.value})} />
                    ) : product.name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {editingProduct === product.id ? (
                      <input type="number" defaultValue={product.price} onBlur={(e) => updateProduct(product.id, {...product, price: e.target.value})} />
                    ) : `&#8358;${product.price}`}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', color: product.stock < 10 ? 'red' : 'black' }}>
                    {editingProduct === product.id ? (
                      <input type="number" defaultValue={product.stock} onBlur={(e) => updateProduct(product.id, {...product, stock: e.target.value})} />
                    ) : product.stock}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {product.images && product.images.length > 0 ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {product.images.slice(0, 3).map((img, idx) => (
                          <img 
                            key={idx} 
                            src={`http://localhost:8000${img}`} 
                            alt="Product" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '3px' }}
                          />
                        ))}
                        {product.images.length > 3 && <span>+{product.images.length - 3}</span>}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>No images</span>
                    )}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button onClick={() => setEditingProduct(editingProduct === product.id ? null : product.id)} style={{...buttonStyle, backgroundColor: '#007bff', color: 'white'}}>Edit</button>
                    <button onClick={() => deleteProduct(product.id)} style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2>Order Management</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Customer</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.customer}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>${order.total}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.date}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '3px', 
                      backgroundColor: order.status === 'Delivered' ? '#d4edda' : order.status === 'Shipped' ? '#fff3cd' : '#f8d7da',
                      color: order.status === 'Delivered' ? '#155724' : order.status === 'Shipped' ? '#856404' : '#721c24'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <select onChange={(e) => updateOrderStatus(order.id, e.target.value)} value={order.status}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>User Management</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '3px', 
                      backgroundColor: user.status === 'Active' ? '#d4edda' : '#f8d7da',
                      color: user.status === 'Active' ? '#155724' : '#721c24'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => toggleUserStatus(user.id)} 
                      style={{...buttonStyle, backgroundColor: user.status === 'Active' ? '#dc3545' : '#28a745', color: 'white'}}
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h2>Sales Analytics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>Revenue Breakdown</h3>
              <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
              <p>Average Order: ${(totalRevenue / orders.length).toFixed(2)}</p>
              <p>Total Orders: {orders.length}</p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>Order Status Distribution</h3>
              <p>Pending: {orders.filter(o => o.status === 'Pending').length}</p>
              <p>Processing: {orders.filter(o => o.status === 'Processing').length}</p>
              <p>Shipped: {orders.filter(o => o.status === 'Shipped').length}</p>
              <p>Delivered: {orders.filter(o => o.status === 'Delivered').length}</p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>Inventory Status</h3>
              <p>Total Products: {products.length}</p>
              <p>Low Stock Items: {lowStockProducts.length}</p>
              <p>Total Stock Value: &#8358;{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;