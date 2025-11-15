import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Internationalization object
const i18n = {
  email: 'Email',
  fullName: 'Full Name',
  address: 'Address',
  city: 'City',
  zipCode: 'Zip Code',
  cardNumber: 'Card Number',
  expiryDate: 'Expiry Date',
  cvv: 'CVV',
  checkout: 'Checkout',
  cartEmpty: 'Your cart is empty',
  continueShopping: 'Continue Shopping',
  shippingInfo: 'Shipping Information',
  paymentInfo: 'Payment Information',
  processing: 'Processing...',
  pay: 'Pay',
  orderSummary: 'Order Summary',
  qty: 'Qty:',
  total: 'Total:'
};

const t = (key) => i18n[key] || key;

function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment successful! Order confirmed.');
      clearCart();
      navigate('/');
      setProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>{t('checkout')}</h1>
        <p>{t('cartEmpty')}</p>
        <a href="/products" style={{ 
          background: '#1a1a1a', 
          color: 'white', 
          padding: '1rem 2rem', 
          textDecoration: 'none', 
          borderRadius: '5px',
          display: 'inline-block',
          marginTop: '1rem'
        }}>
          {t('continueShopping')}
        </a>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>{t('checkout')}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', marginTop: '2rem' }}>
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '15px' }}>
            <h2 style={{ marginBottom: '2rem' }}>{t('shippingInfo')}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('email')}</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-label="Email address"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('fullName')}</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  aria-label="Full name"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('address')}</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                aria-label="Street address"
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('city')}</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  aria-label="City name"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label htmlFor="zipCode" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('zipCode')}</label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  aria-label="Postal zip code"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
            </div>
            
            <h2 style={{ marginBottom: '2rem' }}>{t('paymentInfo')}</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="cardNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('cardNumber')}</label>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                aria-label="Credit card number"
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('expiryDate')}</label>
                <input
                  id="expiryDate"
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  aria-label="Card expiry date"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label htmlFor="cvv" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('cvv')}</label>
                <input
                  id="cvv"
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  aria-label="Card security code"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/payment')}
              style={{
                width: '100%',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              Proceed to Payment
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', position: 'sticky', top: '2rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>{t('orderSummary')}</h2>
            
            {items.map(item => (
              <div key={`checkout-item-${item.id}`} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{t('qty')} {item.quantity}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '2px solid #1a1a1a',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              <span>{t('total')}</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;