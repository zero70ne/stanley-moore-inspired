import React from 'react';
import PropTypes from 'prop-types';
import { useWishlist } from '../context/WishlistContext';

function WishlistButton({ product }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id || product._id);

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id || product._id);
    } else {
      addToWishlist({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.image
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: inWishlist ? '#ff4444' : '#ccc'
      }}
      aria-label={`${inWishlist ? 'Remove from' : 'Add to'} wishlist`}
    >
      ♥
    </button>
  );
}

WishlistButton.propTypes = {
  product: PropTypes.object.isRequired
};

export default WishlistButton;