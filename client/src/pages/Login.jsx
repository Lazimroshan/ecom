import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email: formData.email, password: formData.password });
      login(data);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-brand">
          <div className="logo-mark">SV</div>
          <span className="logo-text">Shop<span className="logo-accent">Verse</span></span>
        </div>
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FiMail size={26} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <FiMail size={18} className="input-icon" />
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <FiLock size={18} className="input-icon" />
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </div>
              <Link to="#" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Signing in...' : <><FiArrowRight size={16} /> Sign In</>}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Sign up</Link>
          </p>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social">
            <button className="btn btn-outline btn-lg w-full social-btn">
              <FiMail size={16} /> Continue with Email
            </button>
          </div>
        </div>
        <p className="auth-terms">
          By signing in, you agree to our{' '}
          <Link to="#" className="auth-terms-link">Terms of Service</Link> and{' '}
          <Link to="#" className="auth-terms-link">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
