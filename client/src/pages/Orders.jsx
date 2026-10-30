import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiAlertCircle, FiTruck, FiLoader } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orderApi';
import { toast } from 'react-toastify';
import './Orders.css';

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_BADGE = {
  pending: 'badge-warning',
  processing: 'badge-primary',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};

const STATUS_ICON = {
  pending: FiClock,
  processing: FiLoader,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiAlertCircle,
};

const ORDER_TIMELINE = ['pending', 'processing', 'shipped', 'delivered'];

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getMyOrders(user.token);
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="spinner-wrap"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>Error loading orders</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container orders-container">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you place an order.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <FiPackage size={16} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container orders-container">
        <div className="orders-header animate-fade-up">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track your order history and status</p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card animate-fade-up">
              <div className="order-card-header">
                <div className="order-info">
                  <span className="order-id">Order #{order._id.slice(-6)}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`status-badge ${STATUS_BADGE[order.status] || 'badge-primary'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <div className="order-tracking">
                <div className="timeline-line" />
                {ORDER_TIMELINE.map((status, i) => {
                  const reached =
                    ORDER_TIMELINE.indexOf(order.status) >= i ||
                    order.status === 'delivered' ||
                    (order.status === 'shipped' && i <= 2) ||
                    (order.status === 'processing' && i <= 1) ||
                    (order.status === 'pending' && i === 0);
                  const isCurrent =
                    ORDER_TIMELINE.indexOf(order.status) === i;
                  const Icon = STATUS_ICON[status] || FiClock;
                  return (
                    <div key={status} className="timeline-step">
                      <div
                        className={`timeline-marker ${
                          reached ? 'reached' : ''
                        } ${isCurrent ? 'current' : ''}`}
                      >
                        {reached ? <Icon size={14} /> : i + 1}
                      </div>
                      <span className="timeline-label">{STATUS_LABELS[status]}</span>
                    </div>
                  );
                })}
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="order-item-image-wrap">
                      <img
                        src={item.image || 'https://placehold.co/60x60/1a1a2e/8b5cf6?text=Product'}
                        alt={item.name}
                        className="order-item-image"
                        onError={(e) => { e.target.src = 'https://placehold.co/60x60/1a1a2e/8b5cf6?text=Product'; }}
                      />
                    </div>
                    <div className="order-item-info">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="order-item-price">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-payment">
                  <span className="payment-label">Payment:</span>
                  <span className="payment-value">{order.paymentMethod}</span>
                </div>
                <div className="order-total">
                  <span className="total-label">Total:</span>
                  <span className="total-value">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
