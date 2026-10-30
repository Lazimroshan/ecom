import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiMail,
  FiPackage,
  FiLock,
  FiUser,
  FiHome,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/orderApi';
import { toast } from 'react-toastify';
import './Checkout.css';

const STEPS = [
  { id: 'shipping', label: 'Shipping', icon: <FiMapPin size={16} /> },
  { id: 'payment', label: 'Payment', icon: <FiCreditCard size={16} /> },
  { id: 'review', label: 'Review', icon: <FiPackage size={16} /> },
];

export default function Checkout() {
  const { cart, cartItems, cartTotal, clearLocalCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.info('Please login to checkout');
      navigate('/login');
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isShippingComplete =
    formData.street && formData.city && formData.state && formData.zip;

  const nextStep = () => {
    if (step === 0 && !isShippingComplete) {
      toast.error('Please fill in all shipping details');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { street, city, state, zip } = formData;
    if (!street || !city || !state || !zip) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      }));

      await placeOrder(user.token, {
        items: orderItems,
        shippingAddress: { street, city, state, zip },
        paymentMethod,
        totalPrice: cartTotal,
      });

      clearLocalCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) return null;
  if (!cartItems || cartItems.length === 0) return null;

  return (
    <div className="page-wrapper">
      <div className="container checkout-container">
        <Link to="/cart" className="back-link">
          <FiArrowLeft size={18} /> Back to Cart
        </Link>

        {/* Stepper */}
        <div className="stepper animate-fade-up">
          {STEPS.map((s, i) => (
            <div key={s.id} className="step">
              <div className={`step-marker ${i <= step ? 'active' : ''}`}>
                {i <= step ? <FiCheckCircle size={14} /> : i + 1}
              </div>
              <span className={`step-label ${i <= step ? 'active' : ''}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-column">
            {step === 0 && (
              <div className="checkout-card glass-card animate-fade-up">
                <h2 className="section-title">Shipping Details</h2>
                <p className="section-subtitle">
                  Where should we deliver your order?
                </p>
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <div className="input-wrapper">
                      <FiMapPin size={18} className="input-icon" />
                      <input
                        className="form-input"
                        type="text"
                        placeholder="123 Main Street"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ZIP / Postal Code</label>
                    <div className="input-wrapper">
                      <FiMail size={18} className="input-icon" />
                      <input
                        className="form-input"
                        type="text"
                        placeholder="123456"
                        value={formData.zip}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={step === 0}
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={!isShippingComplete || placingOrder}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 1 && (
              <div className="checkout-card glass-card animate-fade-up">
                <h2 className="section-title">Payment Method</h2>
                <p className="section-subtitle">
                  Choose how you'd like to pay for your order.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-icon">
                          <FiPhone size={20} />
                        </div>
                        <div>
                          <div className="payment-option-title">Cash on Delivery</div>
                          <div className="payment-option-desc">Pay when your order arrives</div>
                        </div>
                      </div>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={paymentMethod === 'Online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-icon">
                          <FiCreditCard size={20} />
                        </div>
                        <div>
                          <div className="payment-option-title">Online Payment</div>
                          <div className="payment-option-desc">Pay securely online</div>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={placingOrder}
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-card glass-card animate-fade-up">
                <h2 className="section-title">Review & Place Order</h2>
                <p className="section-subtitle">
                  Please review your order before placing it.
                </p>
                <div className="order-items">
                  {cartItems.map((item) => {
                    const product = item.product;
                    return (
                      <div key={item._id} className="order-item">
                        <div className="order-item-image-wrap">
                          <img
                            src={product?.image || 'https://placehold.co/60x60/1a1a2e/8b5cf6?text=Product'}
                            alt={product?.name}
                            className="order-item-image"
                            onError={(e) => { e.target.src = 'https://placehold.co/60x60/1a1a2e/8b5cf6?text=Product'; }}
                          />
                        </div>
                        <div className="order-item-info">
                          <div className="order-item-name">{product?.name}</div>
                          <div className="order-item-qty">Qty: {item.quantity}</div>
                        </div>
                        <div className="order-item-price">
                          ₹{(product?.price || 0) * item.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-summary-divider" />
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>

                <div className="order-meta">
                  <div className="order-meta-item">
                    <div className="order-meta-icon">
                      <FiMapPin size={16} />
                    </div>
                    <div>
                      <div className="order-meta-label">Shipping To</div>
                      <div className="order-meta-value">
                        {formData.street}, {formData.city}, {formData.state} - {formData.zip}
                      </div>
                    </div>
                  </div>
                  <div className="order-meta-item">
                    <div className="order-meta-icon">
                      <FiCreditCard size={16} />
                    </div>
                    <div>
                      <div className="order-meta-label">Payment</div>
                      <div className="order-meta-value">
                        {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-note">
                  <FiLock size={16} />
                  <span>Your payment and personal data are secured with encryption.</span>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary w-full place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? (
                      <>
                        <div className="spinner" style={{ width: 20, height: 20, borderWidth: 3, marginRight: 10 }} />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <FiPackage size={18} /> Place Order – ₹{cartTotal.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary-column">
            <div className="order-summary-card glass-card">
              <h2 className="section-title">Order Summary</h2>
              <div className="order-items">
                {cartItems.map((item) => {
                  const product = item.product;
                  return (
                    <div key={item._id} className="order-item">
                      <div className="order-item-image-wrap">
                        <img
                          src={product?.image || 'https://placehold.co/60x60/1a1a2e/8b5cf6?text=Product'}
                          alt={product?.name}
                          className="order-item-image"
                          onError={(e) => { e.target.src = 'https://placehold.co/60x60/1a1a2e/8b5cf6?text=Product'; }}
                        />
                      </div>
                      <div className="order-item-info">
                        <div className="order-item-name">{product?.name}</div>
                        <div className="order-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="order-item-price">
                        ₹{(product?.price || 0) * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="order-summary-divider" />
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>

              <div className="order-note">
                <FiLock size={16} />
                <span>Your payment and personal data are secured with encryption.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
