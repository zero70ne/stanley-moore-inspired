import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import apiService from '../services/api';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const orderData = await apiService.getOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#28a745';
      case 'shipped': return '#007bff';
      case 'processing': return '#ffc107';
      case 'pending': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#2C2C2C' }}>Order History</h1>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order._id} style={{
                background: 'white',
                borderRadius: '10px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#2C2C2C' }}>
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      marginBottom: '0.5rem'
                    }}>
                      {order.status}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2C2C2C' }}>
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0'
                    }}>
                      <span>{item.productId?.name || 'Product'} x {item.quantity}</span>
                      <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;