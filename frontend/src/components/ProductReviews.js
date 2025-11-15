import React, { useState } from 'react';
import PropTypes from 'prop-types';

function ProductReviews({ productId }) {
  const [reviews] = useState([
    { id: 1, name: 'Sarah M.', rating: 5, comment: 'Beautiful quality and authentic design!' },
    { id: 2, name: 'James K.', rating: 4, comment: 'Great craftsmanship, fits perfectly.' },
    { id: 3, name: 'Amara L.', rating: 5, comment: 'Love the cultural authenticity and style.' }
  ]);

  const StarRating = ({ rating }) => (
    <div style={{ color: '#D4AF37' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Customer Reviews</h3>
      {reviews.map(review => (
        <div key={review.id} style={{
          padding: '1rem',
          border: '1px solid #eee',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong>{review.name}</strong>
            <StarRating rating={review.rating} />
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

ProductReviews.propTypes = {
  productId: PropTypes.number.isRequired
};

export default ProductReviews;