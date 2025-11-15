import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductSearch from '../components/ProductSearch';
import WishlistButton from '../components/WishlistButton';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const products = await apiService.getProducts(filters);
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback to default products if API fails
      const defaultProducts = [
        { id: 1, name: 'Kente Blazer', price: 299, description: 'Traditional Kente pattern blazer with modern tailoring', category: 'men', collection: 'Heritage' },
        { id: 2, name: 'Ankara Dress', price: 199, description: 'Elegant Ankara print dress perfect for special occasions', category: 'women', collection: 'Contemporary' },
        { id: 3, name: 'Dashiki Shirt', price: 89, description: 'Classic Dashiki design with authentic African patterns', category: 'unisex', collection: 'Traditional' }
      ];
      setAllProducts(defaultProducts);
      setFilteredProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    loadProducts(filters);
  };

  const productImages = {
    1: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    2: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop',
    3: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b8b5b5?w=400&h=500&fit=crop',
    4: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
    5: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>Our Collection</h1>
          <p className="section-subtitle">Discover authentic African fashion crafted with heritage and elegance</p>
        </div>
      </div>
      
      <div className="container">
        <ProductSearch onSearch={handleSearch} />
        
        <div className="products-toolbar">
          <div className="results-count">
            Showing {filteredProducts.length} of {allProducts.length} products
          </div>
          <div className="view-controls">
            <button 
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button 
              type="button"
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰ List
            </button>
          </div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className={`products-container ${viewMode}`}>
            {filteredProducts.map(product => (
            <Link key={`filtered-product-${product.id}`} to={`/products/${product.id}`} className={`product-card-${viewMode}`}>
              <div className="product-image-container">
                <img 
                  src={productImages[product.id] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'} 
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
                  <span className="quick-view">Quick View</span>
                </div>
              </div>
              <div className="product-details">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                {viewMode === 'list' && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-meta">
                  <span className="collection">{product.collection}</span>
                  <WishlistButton product={product} />
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
        
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters to find what you're looking for</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;