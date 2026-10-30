import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { updateCartItem, removeFromCart } from '../api/cartApi';
import { toast } from 'react-toastify';
import './Cart.css';

export default function Cart() {
  const { cart, cartItems, cartTotal, cartLoading, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [updating, setUpdating] = useState({});

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating({ ...updating, [itemId]: true });
    try {
      await updateItem(itemId, newQuantity);
      toast.success('Cart updated');
    } catch {
      toast.error('Failed to update quantity');
    } finally {
      const next = { ...updating };
      delete next[itemId];
      setUpdating(next);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdating({ ...updating, [itemId]: true });
    try {
      await removeItem(itemId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      const next = { ...updating };
      delete next[itemId];
      setUpdating(next);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please login to checkout');
      navigate('/login');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (cartLoading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="spinner-wrap"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container cart-container">
          <div className="empty-state cart-empty">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <FiShoppingCart size={16} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container cart-container">
        <div className="cart-header animate-fade-up">
          <Link to="/" className="back-link">
            <FiArrowLeft size={18} /> Continue Shopping
          </Link>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-column">
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const product = item.product;
                return (
                  <div key={item._id} className="cart-item animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <div className="cart-item-image-wrap">
                      <img
                        src={product?.image || 'https://placehold.co/120x120/1a1a2e/8b5cf6?text=Product'}
                        alt={product?.name}
                        className="cart-item-image"
                        onError={(e) => { e.target.src = 'https://placehold.co/120x120/1a1a2e/8b5cf6?text=Product'; }}
                      />
                    </div>
                    <div className="cart-item-content">
                      <Link to={`/products/${product?._id}`} className="cart-item-name">
                        {product?.name}
                      </Link>
                      <p className="cart-item-desc">
                        {product?.description?.slice(0, 80)}{product?.description?.length > 80 ? '...' : ''}
                      </p>
                      <div className="cart-item-footer">
                        <div className="cart-item-price-wrap">
                          <span className="cart-item-price">₹{product?.price?.toLocaleString()}</span>
                          <span className="cart-item-subtotal">× {item.quantity}</span>
                        </div>
                        <div className="quantity-selector">
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating[item._id]}
                          >
                            −
                          </button>
                          <span className="qty-display">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={updating[item._id]}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item._id)}
                          disabled={updating[item._id]}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {updating[item._id] && (
                      <div className="loading-overlay"><div className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} /></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cart-summary-column">
            <div className="cart-summary-card glass-card">
              <div className="summary-header">
                <h2 className="summary-title">Order Summary</h2>
                <FiCheckCircle size={20} className="summary-icon" />
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-free">Free</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <button
                className="btn btn-primary btn-lg w-full checkout-btn"
                onClick={handleCheckout}
                disabled={cartLoading || cartItems.length === 0}
              >
                <FiChevronRight size={16} /> Proceed to Checkout
              </button>
              <p className="summary-note">
                Secure checkout. Your data is protected with encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
