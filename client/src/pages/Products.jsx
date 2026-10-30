import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiList, FiSettings, FiX } from 'react-icons/fi';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Beauty',
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(search, category);
      setProducts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="spinner-wrap"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper products-page">
      <div className="container">
        <div className="products-header animate-fade-up">
          <div className="header-left">
            <h1 className="page-title">All Products</h1>
            <p className="page-subtitle">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="header-actions">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
              aria-pressed={viewMode === 'list'}
            >
              <FiList size={18} />
            </button>
            <button
              className="btn btn-outline btn-sm filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <FiSettings size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="search-filter-bar glass-card">
          <div className="search-wrap">
            <FiSearch size={18} className="search-icon" />
            <input
              className="form-input search-input"
              type="text"
              placeholder="Search products, brands & more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-wrap">
            <FiFilter size={18} className="filter-icon" />
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="filters-panel glass-card animate-fade-up">
            <div className="filters-header">
              <h3 className="filters-title">Refine Results</h3>
              <button
                className="btn btn-sm btn-outline close-filters"
                onClick={() => setFiltersOpen(false)}
              >
                <FiX size={16} /> Close
              </button>
            </div>
            <div className="filters-body">
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <div className="filter-options">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="filter-option">
                      <input
                        type="radio"
                        name="filter-category"
                        value={cat}
                        checked={category === cat}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                      <span className="filter-check"></span>
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>Error loading products</h3>
            <p>{error}</p>
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}

        {!error && products.length > 0 && (
          <div className={`products-container ${viewMode}`}>
            {viewMode === 'grid' ? (
              <div className="products-grid">
                {products.map((p) => (
                  <div key={p._id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="products-list">
                {products.map((p) => (
                  <div key={p._id} className="list-item">
                    <div className="list-item-image-wrap">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="list-item-image"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x300/1a1a2e/8b5cf6?text=Product';
                        }}
                      />
                      <span className="product-category-badge">{p.category}</span>
                    </div>
                    <div className="list-item-content">
                      <Link to={`/products/${p._id}`} className="list-item-name">
                        {p.name}
                      </Link>
                      <p className="list-item-desc">
                        {p.description.slice(0, 140)}{p.description.length > 140 ? '...' : ''}
                      </p>
                      <div className="list-item-footer">
                        <span className="product-price">₹{p.price.toLocaleString()}</span>
                        <button className="btn btn-outline btn-sm add-to-cart-btn">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
