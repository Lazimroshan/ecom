import { Link } from 'react-router-dom';
import { FiGithub, FiMail, FiPhone, FiMapPin, FiClock, FiTruck } from 'react-icons/fi';
import './Footer.css';

const FOOTER_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <div className="logo-mark">SV</div>
            <span className="footer-logo">
              Shop<span className="logo-accent">Verse</span>
            </span>
          </div>
          <p className="footer-tagline">
            Premium quality products delivered to your doorstep. Fast shipping,
            secure payments, and effortless returns.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="GitHub">
              <FiGithub size={18} />
            </a>
            <a href="#" className="social-link" aria-label="Email">
              <FiMail size={18} />
            </a>
            <a href="#" className="social-link" aria-label="Phone">
              <FiPhone size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Shop</h4>
          <ul>
            <li>
              <Link to="/products" className="footer-link">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products?category=Electronics" className="footer-link">
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/products?category=Clothing" className="footer-link">
                Clothing
              </Link>
            </li>
            <li>
              <Link to="/products?category=Books" className="footer-link">
                Books
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Account</h4>
          <ul>
            <li>
              <Link to="/login" className="footer-link">Login</Link>
            </li>
            <li>
              <Link to="/register" className="footer-link">Register</Link>
            </li>
            <li>
              <Link to="/orders" className="footer-link">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="footer-link">Cart</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Customer Care</h4>
          <ul>
            <li className="footer-contact-item">
              <FiMapPin size={16} className="contact-icon" />
              <span className="footer-link">123 Commerce Street, New York</span>
            </li>
            <li className="footer-contact-item">
              <FiPhone size={16} className="contact-icon" />
              <span className="footer-link">+1 (555) 123-4567</span>
            </li>
            <li className="footer-contact-item">
              <FiMail size={16} className="contact-icon" />
              <span className="footer-link">support@shopverse.com</span>
            </li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-newsletter-desc">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime
            deals.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-wrap">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Subscribe
              </button>
            </div>
            <p className="footer-newsletter-note">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-guarantees">
            <div className="guarantee-item">
              <FiTruck size={16} />
              <span>Free Delivery</span>
            </div>
            <div className="guarantee-item">
              <FiClock size={16} />
              <span>30-Day Returns</span>
            </div>
            <div className="guarantee-item">
              <FiMapPin size={16} />
              <span>Secure Payment</span>
            </div>
          </div>
          <div className="footer-copyright">
            <p>
              © {FOOTER_YEAR} ShopVerse. All rights reserved. Built with MERN
              Stack.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
