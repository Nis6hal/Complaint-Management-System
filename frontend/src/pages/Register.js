import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters long.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand-badge">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'inherit' }}>
            <div className="auth-brand-icon">
              <Radio size={24} />
            </div>
            <h2>TelcoResolve</h2>
          </Link>
        </div>

        <div className="auth-box">
          <h1>Create Account</h1>
          <p className="subtitle">Register to submit and track your telecom complaints</p>

          {error && (
            <div className="alert-banner alert-banner-error">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left">
                  <User size={17} />
                </span>
                <input
                  className="form-control has-icon-left"
                  name="name"
                  placeholder="e.g. Sarah Jenkins"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left">
                  <Mail size={17} />
                </span>
                <input
                  className="form-control has-icon-left"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <span>Phone Number</span>
                <span style={{ fontWeight: 400, color: 'var(--slate-400)', fontSize: 12 }}>Optional</span>
              </label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left">
                  <Phone size={17} />
                </span>
                <input
                  className="form-control has-icon-left"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  className="form-control has-icon-left"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  className="form-control has-icon-left"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/" style={{ fontSize: 12, color: 'var(--slate-500)', fontWeight: 500 }}>
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
