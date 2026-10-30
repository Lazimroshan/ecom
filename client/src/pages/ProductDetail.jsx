import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiShield,
  FiClock,
  FiImage,
  FiCheck,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchProductById } from '../api/productApi';
import { fetchProducts } from '../api/productApi';
import { toast } from 'react-toastify';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  ];

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const loadRelated = async () => {
      try {
        const data = await fetchProducts();
        setRelated(data.filter((p) => p._id !== id).slice(0, 4));
      } catch {
        // related products are optional
      }
    };

    loadProduct();
    loadRelated();
  }, [id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addItem(product, quantity);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to checkout');
      navigate('/login');
      return;
    }
    try {
      await addItem(product, quantity);
      navigate('/checkout');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="spinner-wrap"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>Product not found</h3>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stars = Math.round(product.rating);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="page-wrapper product-detail-wrapper">
      <div className="container product-detail-container">
        <Link to="/products" className="back-link">
          <FiArrowLeft size={18} /> Back to Products
        </Link>

        <div className="product-detail-grid">
          {/* Image Gallery */}
          <div className="product-image-section">
            <div className="thumbnail-strip">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumbnail ${
                    activeImage === i ? 'active' : ''
                  }`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt={`Product image ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image-wrap">
              <img
                src={product.image || images[activeImage]}
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  e.target.src = images[activeImage];
                }}
              />
              {isOutOfStock && (
                <span className="out-of-stock-badge">Out of Stock</span>
              )}
            </div>
            <div className="image-counter">
              {activeImage + 1} / {images.length}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <span className="product-category-badge">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className={i < stars ? 'star-filled' : 'star-empty'}
                />
              ))}
              <span className="rating-text">({product.numReviews} reviews)</span>
            </div>

            <p className="product-desc">{product.description}</p>

            <div className="product-price-section">
              <span className="product-price">₹{product.price.toLocaleString()}</span>
              <span className="stock-status">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1 || isOutOfStock}
                >
                  −
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1 && v <= product.stock) setQuantity(v);
                  }}
                  min="1"
                  max={product.stock}
                  disabled={isOutOfStock}
                />
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                >
                  +
                </button>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-primary btn-lg add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <FiShoppingCart size={18} />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  className="btn btn-outline btn-lg buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="product-guarantees">
              <div className="guarantee-item">
                <FiTruck size={18} />
                <div>
                  <strong>Free Delivery</strong>
                  <span>On orders above ₹499</span>
                </div>
              </div>
              <div className="guarantee-item">
                <FiShield size={18} />
                <div>
                  <strong>Secure Payment</strong>
                  <span>100% safe & protected</span>
                </div>
              </div>
              <div className="guarantee-item">
                <FiClock size={18} />
                <div>
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-products">
            <div className="section-header row">
              <div>
                <h2 className="section-title gradient">You Might Also Like</h2>
              </div>
            </div>
            <div className="products-grid">
              {related.map((p) => (
                <div key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
