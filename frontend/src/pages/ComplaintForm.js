import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import api from '../utils/api';

const CATEGORIES = [
  'Network Issue',
  'Billing Problem',
  'Poor Signal',
  'Internet Speed',
  'Customer Service',
  'Roaming Issue',
  'SIM Card Problem',
  'Other',
];

const PRIORITIES = [
  { value: 'Low', label: 'Low — General questions or minor inconvenience' },
  { value: 'Medium', label: 'Medium — Degraded service or performance' },
  { value: 'High', label: 'High — Frequent disconnection or billing error' },
  { value: 'Critical', label: 'Critical — Complete outage or emergency service down' },
];

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'Medium',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.description.trim().length < 20) {
      return setError('Please provide a more detailed description (minimum 20 characters).');
    }

    setLoading(true);
    try {
      await api.post('/complaints', form);
      setSuccess('Your complaint has been submitted successfully! Redirecting...');
      setTimeout(() => navigate('/complaints'), 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const descLength = form.description.trim().length;

  return (
    <div>
      <div className="page-header">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: 12, paddingLeft: 0 }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1>Submit a Complaint</h1>
        <p>Describe your telecom issue so our engineering & support team can investigate immediately</p>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        {error && (
          <div className="alert-banner alert-banner-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert-banner alert-banner-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaint Title *</label>
            <input
              className="form-control"
              name="title"
              placeholder="e.g. Fiber optical light blinking red since morning"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            <div className="form-group">
              <label>Service Category *</label>
              <select
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select
                className="form-control"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <span>Detailed Description *</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: descLength >= 20 ? 'var(--status-resolved-dot)' : 'var(--slate-400)',
                }}
              >
                {descLength}/20 min chars
              </span>
            </label>
            <textarea
              className="form-control"
              name="description"
              placeholder="Please provide specifics: when the issue began, affected phone number or account number, router lights, or speed test results."
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              padding: 12,
              background: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--slate-600)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Info size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
            <span>Tickets are timestamped and assigned to a network engineer within our SLA guidelines.</span>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/complaints')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Submitting...
                </>
              ) : (
                <>
                  <Send size={15} /> Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
