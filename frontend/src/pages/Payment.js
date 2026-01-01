import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { PAYSTACK_PUBLIC_KEY, verifyPaystackPayment } from '../services/payment';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const total = getCartTotal();
  
  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email,
    amount: Math.round(total * 100), // Convert to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
  };

  const handlePaystackSuccess = async (reference) => {
    setProcessing(true);
    setError('');
    
    try {
      // Verify payment
      const verification = await verifyPaystackPayment(reference.reference);
      
      if (verification.success) {
        // Create order
        await apiService.createOrder({
          items: cart,
          total,
          paystackReference: reference.reference
        });
        
        clearCart();
        navigate('/order-success');
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError(err.message);
    }
    
    setProcessing(false);
  };

  const handlePaystackClose = () => {
    setError('Payment was cancelled');
  };

  if (!user || cart.length === 0) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Payment Details</h2>
      
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Order Summary</h3>
        <p><strong>Total: ₦{total.toFixed(2)}</strong></p>
        <p>Email: {user.email}</p>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fee', borderRadius: '3px' }}>
          {error}
        </div>
      )}
      
      {processing ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Processing payment...</p>
        </div>
      ) : (
        <PaystackButton
          {...config}
          text={`Pay ₦${total.toFixed(2)}`}
          onSuccess={handlePaystackSuccess}
          onClose={handlePaystackClose}
          className="paystack-button"
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        />
      )}
    </div>
  );
};

export default Payment;