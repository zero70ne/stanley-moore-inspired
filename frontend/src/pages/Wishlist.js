import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#2C2C2C' }}>My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Your wishlist is empty</h3>
            <p>Add products you love to your wishlist!</p>
            <Link 
              to="/products" 
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '1rem 2rem',
                backgroundColor: '#8B7355',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {wishlist.map(product => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  height: '250px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    product.name
                  )}
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2C2C2C' }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    margin: '0 0 1rem 0', 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    color: '#8B7355' 
                  }}>
                    ${product.price}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        backgroundColor: '#8B7355',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      style={{
                        padding: '0.8rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;