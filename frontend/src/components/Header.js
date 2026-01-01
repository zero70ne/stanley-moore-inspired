import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import QuickSearch from './QuickSearch';
import MobileMenu from './MobileMenu';

function Header() {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const cartCount = getCartCount();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <div className="smi-3d">SMI</div>
          <div className="logo-text">
            <div className="brand-name">STANLEY MOORE</div>
            <div className="brand-tagline">INSPIRED</div>
          </div>
        </Link>
        <nav className="nav desktop-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {user && (
            <Link to="/wishlist" style={{ position: 'relative' }}>
              Wishlist
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}
          <QuickSearch />
          <Link to="/cart" style={{ position: 'relative' }}>
            Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Hi, {user.name}!</span>
              <Link to="/orders">Orders</Link>
              {user.email === 'admin@stanleymoore.com' && (
                <Link to="/admin" style={{ color: '#ff4444', fontWeight: 'bold' }}>Admin</Link>
              )}
              <button 
                type="button"
                onClick={logout}
                style={{
                  background: 'none',
                  border: '1px solid #1a1a1a',
                  color: '#1a1a1a',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        
        <MobileMenu />
      </div>
    </header>
  );
}

Header.propTypes = {};

export default Header;