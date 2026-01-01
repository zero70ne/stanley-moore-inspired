import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import LoadingSpinner from '../components/LoadingSpinner';
import WishlistButton from '../components/WishlistButton';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brand, setBrand] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set default brand data
    setBrand({
      name: 'STANLEY MOORE INSPIRED',
      slogan: 'Celebrating African Heritage Through Fashion'
    });

    // Set default featured products
    setFeaturedProducts([
      { id: 1, name: 'Kente Blazer', price: 299, description: 'Traditional Kente pattern blazer' },
      { id: 2, name: 'Ankara Dress', price: 199, description: 'Elegant Ankara print dress' },
      { id: 3, name: 'Dashiki Shirt', price: 89, description: 'Classic Dashiki design' },
      { id: 4, name: 'Mud Cloth Jacket', price: 249, description: 'Authentic Mud cloth jacket' }
    ]);

    setIsVisible(true);

    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const productImages = {
    1: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
    2: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop',
    3: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b8b5b5?w=400&h=300&fit=crop',
    4: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    5: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop'
  };

  return (
    <div className="home-page">
      {/* Enhanced Hero Section */}
      <section className="hero-enhanced">
        <div className="hero-background"></div>
        <div className="container">
          <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
            <h1 className="hero-title">{brand.name || 'STANLEY MOORE INSPIRED'}</h1>
            <p className="hero-subtitle">{brand.slogan || 'Celebrating African Heritage Through Fashion'}</p>
            <div className="hero-buttons">
              <Link to="/products" className="cta-primary">Shop Collection</Link>
              <Link to="#story" className="cta-secondary">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="story" className="brand-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2 className="animate-on-scroll">Our Heritage</h2>
              <p className="animate-on-scroll">Stanley Moore Inspired celebrates the profound artistry of African culture through meticulously crafted contemporary fashion. Each garment embodies centuries of tradition, masterful craftsmanship, and timeless elegance.</p>
              <p className="animate-on-scroll">From the intricate symbolism of Kente weaving to the refined silhouettes of modern interpretations, we honor ancestral wisdom while embracing contemporary sophistication.</p>
            </div>
            <div className="story-image animate-on-scroll">
              <div className="image-placeholder">African Heritage</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <h2 className="animate-on-scroll">Curated Collection</h2>
          <p className="section-subtitle animate-on-scroll">Discover our meticulously selected pieces that embody the essence of African elegance</p>
          <div className="products-grid-enhanced">
            {featuredProducts.map((product, index) => (
              <Link key={`product-${product.id}`} to={`/products/${product.id}`} className={`product-card-enhanced animate-on-scroll delay-${index} floating-card`}>
                <div className="product-image-enhanced">
                  <img 
                    src={productImages[product.id] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop'} 
                    alt={product.name || 'Product image'}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="image-fallback" style={{
                    background: product.id === 1 ? 'linear-gradient(135deg, #8B4513, #D2691E)' :
                               product.id === 2 ? 'linear-gradient(135deg, #DAA520, #FFD700)' :
                               product.id === 3 ? 'linear-gradient(135deg, #4169E1, #6495ED)' :
                               product.id === 4 ? 'linear-gradient(135deg, #8B4513, #A0522D)' :
                               'linear-gradient(135deg, #FF6347, #FF7F50)',
                    display: 'none'
                  }}>
                    {product.name}
                  </div>
                  <div className="product-overlay">
                    <span className="view-product">View Product</span>
                  </div>
                </div>
                <div className="product-info-enhanced">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>{product.name}</h3>
                    <WishlistButton product={product} />
                  </div>
                  <p className="price">₦{product.price}</p>
                  <p className="description">{product.description}</p>
                  <button type="button" className="add-to-cart-quick">Quick Add</button>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/products" className="view-all-btn">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="animate-on-scroll">What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card animate-on-scroll floating-card">
              <div className="testimonial-content">
                <p>"The craftsmanship and attention to detail in every piece is extraordinary. Stanley Moore Inspired has redefined my understanding of African fashion."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Amara Johnson</h4>
                  <span>Fashion Editor</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card animate-on-scroll floating-card">
              <div className="testimonial-content">
                <p>"Each garment tells a story of heritage and modernity. The quality is unmatched, and the designs are simply breathtaking."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Dr. Kwame Asante</h4>
                  <span>Cultural Historian</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card animate-on-scroll floating-card">
              <div className="testimonial-content">
                <p>"Stanley Moore Inspired represents the perfect fusion of traditional African aesthetics with contemporary sophistication."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Isabella Chen</h4>
                  <span>Style Curator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card animate-on-scroll pulse-glow">
              <div className="feature-icon">◊</div>
              <h3>Authentic Heritage</h3>
              <p>Every piece reflects genuine African cultural traditions and master craftsmanship passed down through generations</p>
            </div>
            <div className="feature-card animate-on-scroll pulse-glow">
              <div className="feature-icon">✦</div>
              <h3>Artisan Quality</h3>
              <p>Meticulously crafted using premium materials and time-honored techniques for enduring elegance</p>
            </div>
            <div className="feature-card animate-on-scroll pulse-glow">
              <div className="feature-icon">⟡</div>
              <h3>Curated Excellence</h3>
              <p>Each collection is thoughtfully designed to celebrate African heritage with contemporary refinement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content animate-on-scroll">
            <h2>Stay Connected</h2>
            <p>Be the first to know about new collections and exclusive offers</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="email-input" />
              <button type="button" className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}

export default Home;