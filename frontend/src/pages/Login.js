import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <h1>Sign In</h1>
          <p className="subtitle">Access your account to file, track, or manage complaints</p>

          {error && (
            <div className="alert-banner alert-banner-error">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                <span>Password</span>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  className="form-control has-icon-left"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account yet? <Link to="/register">Create an account</Link>
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
