import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiPackage,
  FiLogOut,
  FiGrid,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="ShopVerse Home">
          <div className="logo-mark">SV</div>
          <span className="logo-text">Shop<span className="logo-accent">Verse</span></span>
        </Link>

        {/* Desktop Search */}
        <form
          className="navbar-search"
          onSubmit={handleSearch}
          aria-label="Search products"
        >
            <div className="search-wrap">
              <FiSearch size={16} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search products, brands & more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit">
                <FiSearch size={16} />
              </button>
            </div>
          </form>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button
            className="btn-icon search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <FiSearch size={18} />
          </button>
          {user ? (
            <>
              <Link to="/cart" className="cart-btn" aria-label="Cart">
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-dropdown-wrap">
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-menu-btn"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                >
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown animate-slide-right" role="menu">
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiPackage size={15} /> My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiGrid size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="divider" style={{ margin: '8px 0' }} />
                    <button
                      className="dropdown-item dropdown-logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          id="mobile-menu-toggle"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="mobile-search-bar animate-fade">
          <form onSubmit={handleSearch} className="mobile-search-form">
            <FiSearch size={18} className="search-icon" />
            <input
              className="mobile-search-input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Go
            </button>
            <button
              type="button"
              className="btn-icon close-search"
              onClick={() => setSearchOpen(false)}
            >
              <FiX size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fade">
          <div className="mobile-search-wrap">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <FiSearch size={18} className="search-icon" />
              <input
                className="mobile-search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Go
              </button>
            </form>
          </div>
          <div className="mobile-divider" />
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/products" className="mobile-nav-link">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="mobile-nav-link">
                <FiShoppingCart size={18} /> Cart{' '}
                {cartCount > 0 && <span className="cart-badge-inline">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="mobile-nav-link">
                <FiPackage size={18} /> My Orders
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="mobile-nav-link">
                  <FiGrid size={18} /> Admin Panel
                </Link>
              )}
              <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>
                <FiLogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link">
                <FiUser size={18} /> Login
              </Link>
              <Link to="/register" className="mobile-nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
