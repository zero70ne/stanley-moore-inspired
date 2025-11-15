import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.5rem'
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
          className="mobile-overlay"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-300px',
          width: '300px',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          padding: '2rem 1.5rem',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          display: 'none'
        }}
        className="mobile-menu"
      >
        <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
          <button
            onClick={closeMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Link
            to="/"
            onClick={closeMenu}
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontSize: '1.1rem',
              fontWeight: '500',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee'
            }}
          >
            Home
          </Link>
          
          <Link
            to="/products"
            onClick={closeMenu}
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontSize: '1.1rem',
              fontWeight: '500',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee'
            }}
          >
            Products
          </Link>

          {user && (
            <Link
              to="/wishlist"
              onClick={closeMenu}
              style={{
                textDecoration: 'none',
                color: '#1a1a1a',
                fontSize: '1.1rem',
                fontWeight: '500',
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              Wishlist
              {wishlistCount > 0 && (
                <span style={{
                  backgroundColor: '#ff4444',
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

          <Link
            to="/cart"
            onClick={closeMenu}
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontSize: '1.1rem',
              fontWeight: '500',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            Cart
            {getCartCount() > 0 && (
              <span style={{
                backgroundColor: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getCartCount()}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <div style={{
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                Hi, {user.name}!
              </div>
              
              <Link
                to="/orders"
                onClick={closeMenu}
                style={{
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                My Orders
              </Link>
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#ff4444',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  Admin
                </Link>
              )}
              
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                style={{
                  background: 'none',
                  border: '1px solid #ddd',
                  color: '#1a1a1a',
                  padding: '0.8rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  marginTop: '1rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              style={{
                textDecoration: 'none',
                color: '#1a1a1a',
                fontSize: '1.1rem',
                fontWeight: '500',
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee'
              }}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          
          .mobile-overlay {
            display: block !important;
          }
          
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default MobileMenu;