import React from 'react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Your Cart</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', margin: '2rem 0' }}>Your cart is empty</p>
        <LoadingSpinner />
        <a href="/products" style={{ 
          background: '#1a1a1a', 
          color: 'white', 
          padding: '1rem 2rem', 
          textDecoration: 'none', 
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Your Cart ({items.length} items)</h1>
      
      <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
        {items.map(item => (
          <div key={`cart-item-${item.id}`} style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr auto auto',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '10px',
            background: 'white'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: item.id === 1 ? 'linear-gradient(135deg, #8B4513, #D2691E)' :
                         item.id === 2 ? 'linear-gradient(135deg, #DAA520, #FFD700)' :
                         item.id === 3 ? 'linear-gradient(135deg, #4169E1, #6495ED)' :
                         item.id === 4 ? 'linear-gradient(135deg, #8B4513, #A0522D)' :
                         'linear-gradient(135deg, #FF6347, #FF7F50)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              textAlign: 'center',
              padding: '0.5rem'
            }}>
              {item.name}
            </div>
            
            <div>
              <h3>{item.name}</h3>
              <p style={{ color: '#666' }}>&#8358;{item.price}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                type="button"
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                style={{ 
                  background: '#f0f0f0', 
                  border: 'none', 
                  padding: '0.5rem', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ padding: '0 1rem', fontWeight: 'bold' }}>{item.quantity}</span>
              <button 
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{ 
                  background: '#f0f0f0', 
                  border: 'none', 
                  padding: '0.5rem', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
            
            <button 
              type="button"
              onClick={() => removeFromCart(item.id)}
              style={{ 
                background: '#ff4444', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        background: 'white', 
        borderRadius: '10px',
        border: '1px solid #ddd'
      }}>
        <h2>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
          <span>Total: </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="button"
            onClick={clearCart}
            style={{ 
              background: '#666', 
              color: 'white', 
              border: 'none', 
              padding: '1rem 2rem', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear Cart
          </button>
          <a href="/checkout" style={{ 
            background: '#1a1a1a', 
            color: 'white', 
            border: 'none', 
            padding: '1rem 2rem', 
            borderRadius: '5px',
            cursor: 'pointer',
            flex: 1,
            textDecoration: 'none',
            textAlign: 'center',
            display: 'block'
          }}>
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
}

export default Cart;