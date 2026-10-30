import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addItem(product, 1);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const stars = Math.round(product.rating);
  const isOutOfStock = product.stock === 0;

  return (
    <article className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x400/1a1a2e/8b5cf6?text=Product';
          }}
        />
        <div className="product-card-overlay">
          <Link
            to={`/products/${product._id}`}
            className="overlay-btn overlay-view"
            aria-label={`View ${product.name}`}
          >
            <FiEye size={16} />
            <span>View Details</span>
          </Link>
          {!isOutOfStock && (
            <button
              className="overlay-btn overlay-cart"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <FiShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
        <div className="product-card-actions">
          <button
            className="wishlist-btn"
            aria-label="Add to wishlist"
            title="Add to wishlist"
          >
            <FiHeart size={18} />
          </button>
        </div>
        <span className="product-category-badge">{product.category}</span>
        {isOutOfStock && (
          <span className="out-of-stock-badge">Out of Stock</span>
        )}
      </div>

      <div className="product-card-body">
        <Link to={`/products/${product._id}`} className="product-card-name">
          {product.name}
        </Link>

        <p className="product-card-desc">
          {product.description.slice(0, 80)}{product.description.length > 80 ? '...' : ''}
        </p>

        <div className="product-card-footer">
          <div className="product-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={13}
                className={i < stars ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span className="product-rating-num">({product.numReviews})</span>
          </div>
          <span className="product-price">₹{product.price.toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}
