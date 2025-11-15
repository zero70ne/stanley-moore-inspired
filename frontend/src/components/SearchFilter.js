import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const LABELS = {
  search: 'Search',
  category: 'Category',
  priceRange: 'Price Range',
  sortBy: 'Sort By'
};

const OPTIONS = {
  allCategories: 'All Categories',
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
  allPrices: 'All Prices',
  under50: 'Under $50',
  range50to100: '$50 - $100',
  range100to150: '$100 - $150',
  over150: 'Over $150',
  nameAZ: 'Name A-Z',
  priceLowHigh: 'Price: Low to High',
  priceHighLow: 'Price: High to Low'
};

function SearchFilter({ products, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const handleFilter = useCallback(() => {
    try {
      // Validate onFilter callback
      if (typeof onFilter !== 'function') {
        console.error('onFilter must be a function');
        return;
      }

      if (!Array.isArray(products)) {
        onFilter([]);
        return;
      }

      let filtered = [...products];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(product => {
          if (!product?.name || !product?.description) return false;
          return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 product.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }

      // Category filter
      if (category !== 'all') {
        filtered = filtered.filter(product => product?.category === category);
      }

      // Price filter
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(product => {
          if (typeof product?.price !== 'number') return false;
          if (max) {
            return product.price >= min && product.price <= max;
          } else {
            return product.price >= min;
          }
        });
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a?.price || 0) - (b?.price || 0);
          case 'price-high':
            return (b?.price || 0) - (a?.price || 0);
          case 'name':
          default:
            return (a?.name || '').localeCompare(b?.name || '');
        }
      });

      onFilter(filtered);
    } catch (error) {
      console.error('Error filtering products:', error);
      // Safe fallback - only call onFilter if it's a function
      if (typeof onFilter === 'function') {
        try {
          onFilter([]);
        } catch (callbackError) {
          console.error('Error calling onFilter callback:', callbackError);
        }
      }
    }
  }, [searchTerm, category, priceRange, sortBy, products, onFilter]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  return (
    <div className="search-filter-container">
      <div className="filter-grid">
        <div>
          <label htmlFor="search-input" className="filter-label">{LABELS.search}</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
            aria-label="Search products"
          />
        </div>

        <div>
          <label htmlFor="category-select" className="filter-label">{LABELS.category}</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="all">{OPTIONS.allCategories}</option>
            <option value="men">{OPTIONS.men}</option>
            <option value="women">{OPTIONS.women}</option>
            <option value="unisex">{OPTIONS.unisex}</option>
          </select>
        </div>

        <div>
          <label htmlFor="price-select" className="filter-label">{LABELS.priceRange}</label>
          <select
            id="price-select"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
            aria-label="Filter by price range"
          >
            <option value="all">{OPTIONS.allPrices}</option>
            <option value="0-50">{OPTIONS.under50}</option>
            <option value="50-100">{OPTIONS.range50to100}</option>
            <option value="100-150">{OPTIONS.range100to150}</option>
            <option value="150">{OPTIONS.over150}</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-select" className="filter-label">{LABELS.sortBy}</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
            aria-label="Sort products by"
          >
            <option value="name">{OPTIONS.nameAZ}</option>
            <option value="price-low">{OPTIONS.priceLowHigh}</option>
            <option value="price-high">{OPTIONS.priceHighLow}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

SearchFilter.propTypes = {
  products: PropTypes.array,
  onFilter: PropTypes.func.isRequired
};

SearchFilter.defaultProps = {
  products: []
};

export default SearchFilter;