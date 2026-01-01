import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import WishlistButton from '../components/WishlistButton';
import ProductReviews from '../components/ProductReviews';
import SizeGuide from '../components/SizeGuide';
import LoadingSpinner from '../components/LoadingSpinner';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Default products data
    const defaultProducts = {
      1: { id: 1, name: 'Kente Blazer', price: 299, description: 'Traditional Kente pattern blazer with modern tailoring. This sophisticated piece combines authentic African heritage with contemporary fashion sensibilities.', category: 'men', collection: 'Heritage', sizes: ['S', 'M', 'L', 'XL'], colors: ['Gold', 'Black', 'Red'] },
      2: { id: 2, name: 'Ankara Dress', price: 199, description: 'Elegant Ankara print dress perfect for special occasions. Features vibrant patterns and flowing silhouette.', category: 'women', collection: 'Contemporary', sizes: ['XS', 'S', 'M', 'L'], colors: ['Blue', 'Yellow', 'Green'] },
      3: { id: 3, name: 'Dashiki Shirt', price: 89, description: 'Classic Dashiki design with authentic African patterns. Comfortable and stylish for everyday wear.', category: 'unisex', collection: 'Traditional', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Multi', 'Black', 'White'] },
      4: { id: 4, name: 'Mud Cloth Jacket', price: 249, description: 'Authentic Mud cloth jacket with contemporary cut. Handcrafted using traditional techniques.', category: 'men', collection: 'Artisan', sizes: ['M', 'L', 'XL'], colors: ['Brown', 'Beige', 'Black'] },
      5: { id: 5, name: 'Wax Print Skirt', price: 129, description: 'Vibrant wax print skirt with flowing silhouette. Perfect for both casual and formal occasions.', category: 'women', collection: 'Contemporary', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Red', 'Blue', 'Green', 'Yellow'] }
    };
    
    const productData = defaultProducts[id];
    if (productData) {
      setProduct(productData);
    } else {
      // Fallback product
      setProduct({
        id: parseInt(id),
        name: 'African Heritage Piece',
        price: 199,
        description: 'Beautiful African-inspired fashion piece crafted with care and attention to detail.',
        category: 'unisex',
        collection: 'Heritage',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Multi']
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  if (!product) return <div className="container"><LoadingSpinner /></div>;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-image-large" style={{
          background: product.id === 1 ? 'linear-gradient(135deg, #8B4513, #D2691E)' :
                     product.id === 2 ? 'linear-gradient(135deg, #DAA520, #FFD700)' :
                     product.id === 3 ? 'linear-gradient(135deg, #4169E1, #6495ED)' :
                     product.id === 4 ? 'linear-gradient(135deg, #8B4513, #A0522D)' :
                     'linear-gradient(135deg, #FF6347, #FF7F50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {product.name}
        </div>
        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <p className="price-large">&#8358;{product.price}</p>
          <p className="description">{product.description}</p>
          <div className="product-options">
            <div>
              <strong>Sizes:</strong> {product.sizes.join(', ')}
            </div>
            <div>
              <strong>Colors:</strong> {product.colors.join(', ')}
            </div>
            <div>
              <strong>Category:</strong> {product.category} • {product.collection}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <SizeGuide />
            <WishlistButton product={product} />
          </div>
          <button type="button" className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;