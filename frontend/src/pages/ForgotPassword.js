import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Radio, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import api from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setResetToken(response.data.resetToken);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request reset token.");
    } finally {
      setLoading(false);
    }
  };

  if (resetToken) {
    return <ResetPasswordForm resetToken={resetToken} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand-badge">
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "inherit" }}>
            <div className="auth-brand-icon"><Radio size={24} /></div>
            <h2>TelcoResolve</h2>
          </Link>
        </div>

        <div className="auth-box">
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--slate-500)", marginBottom: 16, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          <h1>Reset Password</h1>
          <p className="subtitle">Enter your registered email to receive a secure reset token.</p>

          {error && (
            <div className="alert-banner alert-banner-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleRequestToken}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <span className="input-icon-left"><Mail size={17} /></span>
                <input
                  className="form-control has-icon-left"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
              {loading ? <><span className="spinner" /> Generating Link...</> : <>Send Reset Link <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Remembered your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordForm({ resetToken }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters long.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Token may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand-badge">
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "inherit" }}>
            <div className="auth-brand-icon"><Radio size={24} /></div>
            <h2>TelcoResolve</h2>
          </Link>
        </div>

        <div className="auth-box">
          <h1>Set New Password</h1>
          <p className="subtitle">Choose a secure new password for your account.</p>

          {error && (
            <div className="alert-banner alert-banner-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {success ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#dcfce7", color: "#15803d", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <CheckCircle2 size={30} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Password Reset Successfully!</h3>
              <p style={{ color: "var(--slate-500)", fontSize: 14, marginBottom: 24 }}>
                You can now sign in with your new password.
              </p>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigate("/login")}>
                Sign In Now <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon-left"><Lock size={17} /></span>
                  <input
                    className="form-control has-icon-left"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon-left"><Lock size={17} /></span>
                  <input
                    className="form-control has-icon-left"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
                {loading ? <><span className="spinner" /> Updating...</> : "Update Password"}
              </button>
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Link to="/login" style={{ fontSize: 13, color: "var(--slate-500)", fontWeight: 600 }}>Back to Sign In</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
