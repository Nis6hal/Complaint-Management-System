import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CATEGORIES = [
  'Network Issue', 'Billing Problem', 'Poor Signal',
  'Internet Speed', 'Customer Service', 'Roaming Issue',
  'SIM Card Problem', 'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function ComplaintForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'Medium',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    serviceAddress: '',
    preferredContactMethod: 'Phone',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      contactName: prev.contactName || user.name || '',
      contactPhone: prev.contactPhone || user.phone || '',
      contactEmail: prev.contactEmail || user.email || '',
    }));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.contactPhone) return setError('Contact phone is required for this complaint.');
    if (form.description.length < 20) return setError('Description must be at least 20 characters.');
    setLoading(true);
    try {
      await api.post('/complaints', form);
      setSuccess('✅ Complaint submitted successfully!');
      setTimeout(() => navigate('/complaints'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Submit a Complaint</h1>
        <p>Describe your issue and we'll get back to you as soon as possible</p>
      </div>

      <div className="card" style={{ maxWidth: 620 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaint Title *</label>
            <input className="form-control" name="title" placeholder="Brief summary of the issue" value={form.title} onChange={handleChange} required />
          </div>

          <div className="responsive-grid-2">
            <div className="form-group">
              <label>Category *</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginTop: 8 }}>
            <div className="form-group">
              <label>Contact Name</label>
              <input className="form-control" name="contactName" placeholder="Name on this complaint" value={form.contactName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact Phone *</label>
              <input className="form-control" name="contactPhone" placeholder="Phone number for this complaint" value={form.contactPhone} onChange={handleChange} required />
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginTop: 8 }}>
            <div className="form-group">
              <label>Contact Email</label>
              <input className="form-control" type="email" name="contactEmail" placeholder="Email for this complaint" value={form.contactEmail} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Preferred Contact Method</label>
              <select className="form-control" name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange}>
                <option>Phone</option>
                <option>Email</option>
                <option>Any</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label>Service Address</label>
            <input className="form-control" name="serviceAddress" placeholder="Optional address or location" value={form.serviceAddress} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description * <span style={{ fontWeight: 400, color: '#a0aec0', fontSize: 12 }}>(min 20 characters)</span></label>
            <textarea
              className="form-control"
              name="description"
              placeholder="Describe your issue in detail — when it started, what you've tried, account number, etc."
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
              style={{ resize: 'vertical' }}
            />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
              {form.description.length} characters
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" />Submitting...</> : '📤 Submit Complaint'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
