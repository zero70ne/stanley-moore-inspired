import React, { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div style={{
      background: '#8B7355',
      color: '#F5F5DC',
      padding: '3rem 2rem',
      textAlign: 'center',
      borderRadius: '15px',
      margin: '2rem 0'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Stay Updated</h3>
      <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
        Get the latest collections and exclusive offers
      </p>
      
      {subscribed ? (
        <div style={{ color: '#90EE90', fontSize: '1.1rem' }}>
          ✓ Thank you for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2C2C2C',
              color: '#F5F5DC',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export default Newsletter;