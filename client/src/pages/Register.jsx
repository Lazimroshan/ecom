import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ name: formData.name, email: formData.email, password: formData.password });
      login(data);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
              <FiUser size={26} />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join ShopVerse today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <FiUser size={18} className="input-icon" />
                <input
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
            </div>

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
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Creating account...' : <><FiArrowRight size={16} /> Create Account</>}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
        <p className="auth-terms">
          By signing up, you agree to our{' '}
          <Link to="#" className="auth-terms-link">Terms of Service</Link> and{' '}
          <Link to="#" className="auth-terms-link">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
