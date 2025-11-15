import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center', 
      maxWidth: '600px', 
      margin: '0 auto' 
    }}>
      <div style={{ 
        backgroundColor: '#d4edda', 
        color: '#155724', 
        padding: '30px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem' }}>✅</h1>
        <h2 style={{ margin: '0 0 10px 0' }}>Order Successful!</h2>
        <p style={{ margin: '0', fontSize: '1.1rem' }}>
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/products" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Continue Shopping
        </Link>
        
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;