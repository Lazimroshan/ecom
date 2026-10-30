import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import {
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiZap,
} from 'react-icons/fi';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing', emoji: '👕', color: 'from-rose-500 to-pink-500' },
  { name: 'Books', emoji: '📚', color: 'from-indigo-500 to-purple-500' },
  { name: 'Home', emoji: '🏠', color: 'from-amber-500 to-orange-500' },
  { name: 'Sports', emoji: '⚽', color: 'from-emerald-500 to-teal-500' },
  { name: 'Beauty', emoji: '💄', color: 'from-fuchsia-500 to-violet-500' },
];

const FEATURES = [
  { icon: <FiTruck size={24} />, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: <FiShield size={24} />, title: 'Secure Payment', desc: '100% safe & protected' },
  { icon: <FiShoppingBag size={24} />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <FiZap size={24} />, title: 'Fast Shipping', desc: 'Delivered in 2-3 days' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setFeatured(data.slice(0, 8));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load products');
          setFeatured([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();
    return () => { cancelled = true; };
  }, []);

  return (
    <main>
      {/* ---- Hero Section ---- */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-glow glow-1" />
        <div className="hero-glow glow-2" />
        <div className="container hero-content animate-fade-up">
          <span className="hero-tag">🔥 New Arrivals Every Week</span>
          <h1 className="hero-title">
            Discover Your <br />
            <span className="hero-gradient-text">Perfect Style</span>
          </h1>
          <p className="hero-subtitle">
            Shop thousands of premium products across all categories. Fast
            delivery, secure payments, and unbeatable prices.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-now">
              Shop Now <FiArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" id="hero-join">
              Join for Free
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>10K+</strong>
              <span>Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>50K+</strong>
              <span>Customers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>4.9★</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features Bar ---- */}
      <section className="features-section">
        <div className="container features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card glass-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Categories ---- */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title gradient">Shop by Category</h2>
              <p className="section-subtitle">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="category-card glass-card"
                id={`cat-${cat.name.toLowerCase()}`}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured Products ---- */}
      <section className="section products-section">
        <div className="container">
          <div className="section-header row">
            <div>
              <h2 className="section-title gradient">Featured Products</h2>
              <p className="section-subtitle">Handpicked just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm" id="view-all-products">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3>Unable to load products</h3>
              <p>{error}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  window.location.reload();
                }}
              >
                Try Again
              </button>
            </div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No products yet</h3>
              <p>Add products from the Admin Dashboard</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p, i) => (
                <div key={p._id} style={{ animationDelay: `${i * 0.08}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-content">
            <h2 className="cta-title gradient">Ready to Start Shopping?</h2>
            <p className="cta-subtitle">
              Create an account and get access to exclusive deals & offers
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg" id="cta-register">
              Get Started Free
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg" id="cta-browse">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
